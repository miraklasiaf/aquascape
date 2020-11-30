import { useSWRInfinite } from "swr"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { fetcher } from "./fetcher"
import { PAGE_LIMIT, BASE_API_URL } from "./constants"

dayjs.extend(relativeTime)

export const useRedditPosts = (subreddit: string, sort = "hot") => {
  if (!subreddit) {
    throw new Error("Subreddit is required")
  }

  const url = `${BASE_API_URL}/r/${subreddit}/${sort}.json?raw_json=1`

  const { data, error, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.data.after) return null // reached the end
      if (pageIndex === 0) return `${url}&limit=${PAGE_LIMIT}` // first page, we don't have `previousPageData`

      return `${url}&after=${previousPageData.data.after}&limit=${PAGE_LIMIT}` // add the cursor to the API endpoint
    },
    fetcher,
  )

  const posts = data ? data.map((i) => i.data.children).flat() : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === "undefined"
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && !data[data.length - 1]?.data?.after)

  return {
    posts,
    error,
    isLoadingInitialData,
    isLoadingMore,
    size,
    setSize,
    isReachingEnd,
  }
}

export const transformPost = (post, mediaSizeIndex = 3) => {
  let url
  let gallery = []

  const {
    id,
    title,
    author,
    ups,
    all_awardings,
    media_metadata,
    is_gallery,
    preview,
    created_utc,
    permalink,
  } = post.data

  console.log(post.data)

  if (is_gallery) {
    try {
      const galleryIds = Object.keys(media_metadata)
      const resolutions = media_metadata[galleryIds[0]].p

      if (resolutions[mediaSizeIndex]) {
        url = media_metadata[galleryIds[0]].p[mediaSizeIndex].u
        gallery = galleryIds.map((id) => media_metadata[id].p[mediaSizeIndex].u)
      } else {
        url = media_metadata[galleryIds[0]].p[resolutions.length - 1].u
        gallery = galleryIds.map(
          (id) => media_metadata[id].p[resolutions.length - 1].u,
        )
      }
    } catch (e) {
      console.log("Error loading image in", post.data)
      url = "https://via.placeholder.com/275?text=Error%20loading%20image"
    }
  } else {
    try {
      const resolutions = preview.images[0].resolutions
      if (resolutions[mediaSizeIndex]) {
        url = resolutions[mediaSizeIndex].url
      } else {
        url = resolutions[resolutions.length - 1].url
      }
    } catch (e) {
      console.log("Error loading image in", post.data)
      url = "https://via.placeholder.com/275?text=Error%20loading%20image"
    }
  }

  return {
    id,
    title,
    src: url,
    author,
    ups,
    awards: all_awardings.map((award) => ({
      src: award.resized_static_icons[0].url,
      count: award.count,
      description: award.description,
    })),
    createdAt: dayjs.unix(created_utc).fromNow(),
    permalink: `https://reddit.com${permalink}`,
    isGallery: is_gallery === true,
    gallery,
  }
}

export default useRedditPosts
