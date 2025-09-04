import { APIClient } from './api'
import { airstackConfig } from '../config'
import { 
  AirstackQueryRequest,
  AirstackQueryResponse,
  AirstackTokenData,
  APIResponse 
} from '../types/api'

class AirstackService {
  private client: APIClient

  constructor() {
    this.client = new APIClient({
      baseUrl: airstackConfig.baseUrl,
      defaultHeaders: {
        'Authorization': `Bearer ${airstackConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: airstackConfig.timeout,
      retryAttempts: airstackConfig.retryAttempts,
      retryDelay: airstackConfig.retryDelay
    })
  }

  /**
   * Execute a GraphQL query against Airstack API
   */
  async query<T = any>(request: AirstackQueryRequest): Promise<APIResponse<T>> {
    try {
      const response = await this.client.post<AirstackQueryResponse<T>>('', {
        query: request.query,
        variables: request.variables || {}
      })

      if (!response.success) {
        return response
      }

      if (response.data?.error) {
        return {
          success: false,
          error: {
            code: 'GRAPHQL_ERROR',
            message: response.data.error[0]?.message || 'GraphQL query failed',
            details: response.data.error
          }
        }
      }

      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AIRSTACK_QUERY_ERROR',
          message: error instanceof Error ? error.message : 'Unknown Airstack query error',
          details: error
        }
      }
    }
  }

  /**
   * Search for music-related NFTs by metadata
   */
  async searchMusicNFTs(
    searchTerm: string,
    blockchain: 'ethereum' | 'polygon' | 'base' = 'ethereum'
  ): Promise<APIResponse<AirstackTokenData[]>> {
    const query = `
      query SearchMusicNFTs($searchTerm: String!, $blockchain: TokenBlockchain!) {
        TokenNfts(
          input: {
            filter: {
              name: { _regex: $searchTerm }
              blockchain: $blockchain
            }
            blockchain: $blockchain
            limit: 50
          }
        ) {
          TokenNft {
            address
            tokenId
            blockchain
            metaData {
              name
              description
              image
              attributes {
                trait_type
                value
              }
            }
            token {
              name
              symbol
              type
              owner {
                addresses
                domains {
                  name
                  isPrimary
                }
                socials {
                  dappName
                  profileName
                  profileTokenId
                  profileTokenAddress
                  userAssociatedAddresses
                }
              }
            }
          }
        }
      }
    `

    const response = await this.query<{ TokenNfts: { TokenNft: AirstackTokenData[] } }>({
      query,
      variables: {
        searchTerm,
        blockchain: blockchain.toUpperCase()
      }
    })

    if (!response.success) {
      return response
    }

    return {
      success: true,
      data: response.data?.TokenNfts?.TokenNft || []
    }
  }

  /**
   * Get NFT ownership information by contract address and token ID
   */
  async getNFTOwnership(
    contractAddress: string,
    tokenId: string,
    blockchain: 'ethereum' | 'polygon' | 'base' = 'ethereum'
  ): Promise<APIResponse<AirstackTokenData>> {
    const query = `
      query GetNFTOwnership($address: Address!, $tokenId: String!, $blockchain: TokenBlockchain!) {
        TokenNft(
          input: {
            address: $address
            tokenId: $tokenId
            blockchain: $blockchain
          }
        ) {
          address
          tokenId
          blockchain
          metaData {
            name
            description
            image
            attributes {
              trait_type
              value
            }
          }
          token {
            name
            symbol
            type
            owner {
              addresses
              domains {
                name
                isPrimary
              }
              socials {
                dappName
                profileName
                profileTokenId
                profileTokenAddress
                userAssociatedAddresses
              }
            }
          }
        }
      }
    `

    const response = await this.query<{ TokenNft: AirstackTokenData }>({
      query,
      variables: {
        address: contractAddress,
        tokenId,
        blockchain: blockchain.toUpperCase()
      }
    })

    if (!response.success) {
      return response
    }

    if (!response.data?.TokenNft) {
      return {
        success: false,
        error: {
          code: 'NFT_NOT_FOUND',
          message: 'NFT not found with the provided contract address and token ID'
        }
      }
    }

    return {
      success: true,
      data: response.data.TokenNft
    }
  }

  /**
   * Search for wallet addresses associated with a domain name
   */
  async resolveENSDomain(domain: string): Promise<APIResponse<string[]>> {
    const query = `
      query ResolveENSDomain($domain: String!) {
        Domains(
          input: {
            filter: {
              name: { _eq: $domain }
            }
            blockchain: ethereum
            limit: 1
          }
        ) {
          Domain {
            resolvedAddress
            owner
          }
        }
      }
    `

    const response = await this.query<{ Domains: { Domain: { resolvedAddress: string; owner: string }[] } }>({
      query,
      variables: { domain }
    })

    if (!response.success) {
      return response
    }

    const domains = response.data?.Domains?.Domain || []
    const addresses = domains.map(d => d.resolvedAddress || d.owner).filter(Boolean)

    return {
      success: true,
      data: addresses
    }
  }

  /**
   * Get social profiles associated with a wallet address
   */
  async getSocialProfiles(walletAddress: string): Promise<APIResponse<any[]>> {
    const query = `
      query GetSocialProfiles($address: Identity!) {
        Socials(
          input: {
            filter: {
              identity: { _eq: $address }
            }
            blockchain: ethereum
            limit: 50
          }
        ) {
          Social {
            dappName
            profileName
            profileDisplayName
            profileImage
            profileBio
            profileUrl
            userAssociatedAddresses
            followerCount
            followingCount
          }
        }
      }
    `

    const response = await this.query<{ Socials: { Social: any[] } }>({
      query,
      variables: { address: walletAddress }
    })

    if (!response.success) {
      return response
    }

    return {
      success: true,
      data: response.data?.Socials?.Social || []
    }
  }

  /**
   * Search for potential music rights holders by combining multiple data sources
   */
  async searchMusicRightsHolders(
    artistName: string,
    trackTitle?: string
  ): Promise<APIResponse<{
    nfts: AirstackTokenData[]
    socialProfiles: any[]
    domains: string[]
  }>> {
    try {
      // Search for music NFTs related to the artist
      const searchTerm = trackTitle ? `${artistName} ${trackTitle}` : artistName
      const nftResponse = await this.searchMusicNFTs(searchTerm)

      // Try to resolve ENS domain for the artist
      const domainResponse = await this.resolveENSDomain(`${artistName.toLowerCase().replace(/\s+/g, '')}.eth`)

      // Get social profiles if we found wallet addresses
      let socialProfiles: any[] = []
      if (domainResponse.success && domainResponse.data && domainResponse.data.length > 0) {
        const socialResponse = await this.getSocialProfiles(domainResponse.data[0])
        if (socialResponse.success && socialResponse.data) {
          socialProfiles = socialResponse.data
        }
      }

      return {
        success: true,
        data: {
          nfts: nftResponse.success ? nftResponse.data || [] : [],
          socialProfiles,
          domains: domainResponse.success ? domainResponse.data || [] : []
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SEARCH_RIGHTS_HOLDERS_ERROR',
          message: error instanceof Error ? error.message : 'Unknown search rights holders error',
          details: error
        }
      }
    }
  }

  /**
   * Verify if a wallet address owns specific music-related tokens
   */
  async verifyMusicOwnership(
    walletAddress: string,
    searchCriteria: {
      artistName?: string
      trackTitle?: string
      contractAddress?: string
      tokenId?: string
    }
  ): Promise<APIResponse<{
    owns: boolean
    tokens: AirstackTokenData[]
  }>> {
    let query: string
    let variables: any

    if (searchCriteria.contractAddress && searchCriteria.tokenId) {
      // Check specific NFT ownership
      query = `
        query VerifySpecificNFTOwnership($address: Identity!, $contractAddress: Address!, $tokenId: String!) {
          TokenBalances(
            input: {
              filter: {
                owner: { _eq: $address }
                tokenAddress: { _eq: $contractAddress }
                tokenId: { _eq: $tokenId }
              }
              blockchain: ethereum
              limit: 1
            }
          ) {
            TokenBalance {
              tokenNfts {
                address
                tokenId
                blockchain
                metaData {
                  name
                  description
                  image
                  attributes {
                    trait_type
                    value
                  }
                }
              }
            }
          }
        }
      `
      variables = {
        address: walletAddress,
        contractAddress: searchCriteria.contractAddress,
        tokenId: searchCriteria.tokenId
      }
    } else {
      // Search by artist/track name
      const searchTerm = searchCriteria.trackTitle 
        ? `${searchCriteria.artistName} ${searchCriteria.trackTitle}`
        : searchCriteria.artistName || ''

      query = `
        query VerifyMusicOwnership($address: Identity!, $searchTerm: String!) {
          TokenBalances(
            input: {
              filter: {
                owner: { _eq: $address }
                tokenType: { _eq: ERC721 }
              }
              blockchain: ethereum
              limit: 50
            }
          ) {
            TokenBalance {
              tokenNfts {
                address
                tokenId
                blockchain
                metaData {
                  name
                  description
                  image
                  attributes {
                    trait_type
                    value
                  }
                }
              }
            }
          }
        }
      `
      variables = {
        address: walletAddress,
        searchTerm
      }
    }

    const response = await this.query<{ TokenBalances: { TokenBalance: { tokenNfts: AirstackTokenData[] }[] } }>({
      query,
      variables
    })

    if (!response.success) {
      return response
    }

    const tokenBalances = response.data?.TokenBalances?.TokenBalance || []
    const tokens = tokenBalances.flatMap(balance => balance.tokenNfts || [])

    // Filter tokens that match the search criteria
    let relevantTokens = tokens
    if (searchCriteria.artistName || searchCriteria.trackTitle) {
      const searchTerms = [
        searchCriteria.artistName?.toLowerCase(),
        searchCriteria.trackTitle?.toLowerCase()
      ].filter(Boolean)

      relevantTokens = tokens.filter(token => {
        const name = token.metaData?.name?.toLowerCase() || ''
        const description = token.metaData?.description?.toLowerCase() || ''
        
        return searchTerms.some(term => 
          name.includes(term!) || description.includes(term!)
        )
      })
    }

    return {
      success: true,
      data: {
        owns: relevantTokens.length > 0,
        tokens: relevantTokens
      }
    }
  }

  /**
   * Test Airstack API connection
   */
  async testConnection(): Promise<APIResponse<any>> {
    const query = `
      query TestConnection {
        TokenNfts(
          input: {
            filter: {
              name: { _regex: "test" }
            }
            blockchain: ethereum
            limit: 1
          }
        ) {
          TokenNft {
            address
            tokenId
          }
        }
      }
    `

    return this.query({ query })
  }
}

export const airstackService = new AirstackService()
export default airstackService
