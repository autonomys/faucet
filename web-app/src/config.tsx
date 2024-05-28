import Head from 'next/head'

const titleDefault = 'Subspace Testnet Faucet'
const url = 'https://faucet.subspace.network'
const description =
  'Subspace Testnet Faucet - Get testnet tokens for the Subspace Network. Subspace is a fourth generation blockchain built for the next wave of crypto creators'
const keywords = 'subspace,faucet,testnet'
const author = 'Subspace Network'
const twitter = '@NetworkSubspace'
const icon = 'logo.png'
const svgIcon = 'logo.svg'
const shareImage = url + '/images/share.png'
const request_url = url + '/api/requestTokens'

export const metadata = {
  title: titleDefault,
  url,
  description,
  keywords,
  author,
  twitter,
  icon,
  svgIcon,
  shareImage,
  request_url
}

const Header = ({ title = titleDefault }) => {
  return (
    <Head>
      {/* Recommended Meta Tags */}
      <meta charSet='utf-8' />
      <meta name='language' content='english' />
      <meta httpEquiv='content-type' content='text/html' />
      <meta name='author' content={author} />
      <meta name='designer' content={author} />
      <meta name='publisher' content={author} />

      {/* Search Engine Optimization Meta Tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <meta name='robots' content='index,follow' />
      <meta name='distribution' content='web' />
      <meta name='og:title' content={title} />
      <meta name='og:type' content='site' />
      <meta name='og:url' content={url} />
      <meta name='og:image' content={shareImage} />
      <meta name='og:site_name' content={title} />
      <meta name='og:description' content={description} />

      {/* Frames Interactive metadata */}
      <meta property='fc:frame' content='vNext' />
      <meta property='fc:frame:image' content={shareImage} />
      <meta property='fc:frame:image:aspect_ratio' content='1.91:1' />
      <meta property='fc:frame:post_url' content={request_url} />
      <meta property={`fc:frame:button:1`} content={'Request Nova Testnet Token'} />
      <meta property={`fc:frame:button:1:action`} content={'post'} />
      <meta property={`fc:frame:button:1:target`} content={request_url} />
      {/* <meta property={`fc:frame:button:1`} content={'View transaction'} />
      <meta property={`fc:frame:button:2`} content={'View your wallet'} /> */}

      <link rel='manifest' href='/manifest.json' />
      <link rel='mask-icon' color='#000000' href={svgIcon} />

      {/* Meta Tags for HTML pages on Mobile */}
      <meta name='format-detection' content='telephone=yes' />
      <meta name='HandheldFriendly' content='true' />
      <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1.0' />
      <meta name='theme-color' content='#000' />
      <link rel='shortcut icon' type='image/x-icon' href={icon} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:url' content={url} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={shareImage} />
      <meta name='twitter:site' content={twitter} />
    </Head>
  )
}

export default Header
