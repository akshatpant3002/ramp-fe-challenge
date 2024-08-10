import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    console.log("even being called??")
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }

      const newData = previousResponse
      ? [...previousResponse.data, ...response.data]
      : response.data

      return { data: newData, nextPage: response.nextPage }
    })
  }, [fetchWithCache, paginatedTransactions])  

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  const hasMorePages = paginatedTransactions?.nextPage !== null;


  return { data: paginatedTransactions, loading, fetchAll, invalidateData, hasMorePages}
}
