export function extractVideoId(url) {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export async function fetchVideoMetadata(videoId) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('YouTube API request failed')
  }
  const data = await res.json()
  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found')
  }
  const item = data.items[0]
  return {
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnailUrl:
      item.snippet.thumbnails.maxres?.url ||
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url,
    duration: item.contentDetails.duration,
  }
}
