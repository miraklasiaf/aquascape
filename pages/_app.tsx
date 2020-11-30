import { ChakraProvider } from "@chakra-ui/react"
import { siteConfig } from "@/configs"
import { AppProps } from "next/app"
import { DefaultSeo } from "next-seo"
import { theme } from "@/components/core"

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...siteConfig.seo} />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default App
