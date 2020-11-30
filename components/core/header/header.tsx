import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useColorModeValue,
} from "@chakra-ui/react"
import { ThemeSwitcher } from "@/components/ui"
import { Adjustments } from "@/components/icons"

export default function Header({ filter, setFilter }) {
  const bgColor = useColorModeValue("white", "gray.800")

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Box position="fixed" top={0} insetX={0} zIndex={1} bg={bgColor}>
      <Container
        maxW="xl"
        py={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button variant="ghost" fontSize="xl" onClick={scrollToTop}>
          Aquascape
        </Button>
        <Box>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={IconButton}
              variant="ghost"
              aria-label="Sort by"
              icon={<Adjustments color="current" />}
            />
            <MenuList minWidth="240px">
              <MenuOptionGroup
                title="Filter"
                defaultValue={filter}
                type="radio"
                onChange={(val) => {
                  setFilter(val)
                  scrollToTop()
                }}
              >
                <MenuItemOption value="hot">Hot</MenuItemOption>
                <MenuItemOption value="new">New</MenuItemOption>
                <MenuItemOption value="top">Top</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <ThemeSwitcher />
        </Box>
      </Container>
    </Box>
  )
}
