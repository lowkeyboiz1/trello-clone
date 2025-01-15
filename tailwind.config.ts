const { nextui } = require('@nextui-org/react')
import type { Config } from 'tailwindcss'

export const HEADER_HEIGHT = '70px'
export const BOARDBAR_HEIGHT = '80px'
export const BOARDCONTAINER_HEIGHT = `calc(100vh - ${HEADER_HEIGHT})`
export const BOARDCONTENT_HEIGHT = `calc(100vh - (${HEADER_HEIGHT} + ${BOARDBAR_HEIGHT}))`
export const CLOUMN_HEIGHT = `calc(${BOARDCONTENT_HEIGHT} - 116px)`

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    height: {
      header: HEADER_HEIGHT,
      boardBar: BOARDBAR_HEIGHT,
      boardContent: BOARDCONTENT_HEIGHT,
      column: CLOUMN_HEIGHT,
      boardContainer: BOARDCONTAINER_HEIGHT
    }
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            colorHeader: '#294ac4',
            colorBoardBar: '#305cda',
            colorBoardContent: '#305bda',
            primary: '#fff',
            primary2: '#292D32'
          }
        },
        dark: {
          colors: {
            colorHeader: '#294ac4',
            colorBoardBar: '#305cda',
            colorBoardContent: '#305bda',
            primary: '#292D32',
            primary2: '#fff'
          }
        }
      }
    })
  ]
}

export default config
