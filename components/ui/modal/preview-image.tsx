import "react-responsive-carousel/lib/styles/carousel.min.css"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
  HStack,
  Image,
  Img,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { Carousel } from "react-responsive-carousel"

const MotionImage = motion.custom(Image)

export default function PreviewImage({ isOpen, onClose, post }) {
  const size = useBreakpointValue({ base: "md", md: "2xl" })

  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0}>
          {post.isGallery ? (
            <Carousel showThumbs={false} dynamicHeight useKeyboardArrows>
              {post.gallery.map((src) => (
                <Img key={src} src={src} />
              ))}
            </Carousel>
          ) : (
            <Img
              w="full"
              src={post.src}
              objectFit="cover"
              borderTopRadius={6}
            />
          )}
          <Flex direction="column" p={4}>
            <HStack spacing={1}>
              {post.awards.map((award, index) => {
                return (
                  <Tooltip
                    key={index}
                    label={award.description}
                    aria-label="Award tooltip"
                  >
                    <Flex>
                      <MotionImage
                        whileHover={{ rotate: [0, 10, -10, 0] }}
                        src={award.src}
                      />
                      {award.count > 1 && (
                        <Text ml="2px" fontSize="xs">
                          3
                        </Text>
                      )}
                    </Flex>
                  </Tooltip>
                )
              })}
            </HStack>
            <Text mt={3} fontSize="md">
              {post.title}
            </Text>
            <Text fontSize="xs" mt={2}>
              Posted by <Link>u/{post.author}</Link> {post.createdAt}
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            as="a"
            rightIcon={<ExternalLinkIcon />}
            colorScheme="gray"
            href={post.permalink}
            target="_blank"
            mr={3}
          >
            Open in Reddit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
