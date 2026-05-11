import { listFeedItems } from '../utils/feed'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  return listFeedItems(config)
})
