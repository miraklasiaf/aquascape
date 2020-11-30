import * as React from "react"
import {
  Flex,
  Box,
  Link,
  Text,
  Container,
  SimpleGrid,
  Skeleton,
  Button,
  useDisclosure,
} from "@chakra-ui/react"
import { Header, SEO } from "@/components/core"
import { useRedditPosts, transformPost } from "@/lib/use-reddit-posts"
import { SUBREDDIT, PAGE_LIMIT } from "@/lib/constants"
import { SimpleCard, PreviewImage } from "@/components/ui"
import { ChevronDown } from "@/components/icons"

const withMediaOnly = (item) => {
  if (item.data.crosspost_parent) return false

  if (
    (!item.data.is_self ||
      (item.data.domain && item.data.domain === "i.redd.it")) &&
    !item.data.media
  )
    return true

  return false
}

export default function Home() {
  const [filter, setFilter] = React.useState("hot")
  const [selectedPost, setSelectedPost] = React.useState(null)
  const {
    posts,
    error,
    isLoadingInitialData,
    isLoadingMore,
    size,
    setSize,
    isReachingEnd,
  } = useRedditPosts(SUBREDDIT, filter)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (error) {
    return (
      <Text p={4}>
        An error occurred. Please <Link href="/">reload</Link> or use VPN.
      </Text>
    )
  }

  const transformedPosts = !isLoadingInitialData
    ? posts.filter(withMediaOnly).map((post) => transformPost(post))
    : []

  const view = (post) => {
    setSelectedPost(post)
    onOpen()
  }

  return (
    <Flex direction="column" placeItems="center" h="screen" py={8}>
      <SEO title="Aquascape" description="Aquascape gallery from r/aquascape" />
      <Header filter={filter} setFilter={setFilter} />

      <Container maxW="xl" mt="95px" flex={1}>
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="semibold" mt={2}>
            Aquascaping gallery from{" "}
            <Link href="https://reddit.com/r/aquascaping" isExternal>
              r/Aquascape
            </Link>
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mt={6}>
          {transformedPosts.map((post) => (
            <SimpleCard key={post.id} post={post} onImageClick={view} />
          ))}

          {(isLoadingInitialData || isLoadingMore) &&
            [...Array(PAGE_LIMIT).keys()].map((item) => (
              <Skeleton
                borderRadius={["sm", null, "md"]}
                key={item}
                height="275px"
              />
            ))}
        </SimpleGrid>

        {!isReachingEnd && (
          <Box textAlign="center" mt={8}>
            <Button
              leftIcon={<ChevronDown />}
              onClick={() => setSize(size + 1)}
              isLoading={isLoadingMore}
            >
              See More
            </Button>
          </Box>
        )}
      </Container>
      {selectedPost && (
        <PreviewImage isOpen={isOpen} onClose={onClose} post={selectedPost} />
      )}
      <Container as="footer" maxW="xl" textAlign="center" py={10}>
        <Text>
          Made by{" "}
          <Link href="http://miraklasiaf.com/" isExternal>
            miraklasiaf
          </Link>
        </Text>
      </Container>
    </Flex>
  )
}
