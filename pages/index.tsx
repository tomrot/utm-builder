import { useState, useEffect } from 'react'
import sanitizeText from '../utils/sanitizeText'
import formatToDDMMYY from '../utils/formatToDDMMYY'

const campaignTypesByPlatform: Record<string, { label: string; value: string }[]> = {
  Facebook: [
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Brand Awareness', value: 'awr' },
    { label: 'Reach', value: 'reach' },
    { label: 'Traffic', value: 'trfc' },
    { label: 'Engagement', value: 'eng' },
    { label: 'Video Views', value: 'vv' },
    { label: 'Messages', value: 'msg' },
    { label: 'Boost', value: 'bst' },
  ],
  'Google Ads': [
    { label: 'Search', value: 'srch' },
    { label: 'Display / GDN', value: 'gdn' },
    { label: 'Discovery', value: 'disc' },
    { label: 'Performance Max', value: 'pmax' },
    { label: 'YouTube (video)', value: 'yt' },
  ],
  'Microsoft Ads': [
    { label: 'Search', value: 'srch' },
    { label: 'Audience Ads / MAN', value: 'man' },
    { label: 'Smart Search Campaign', value: 'smrt' },
  ],
  TikTok: [
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Reach', value: 'reach' },
    { label: 'Traffic', value: 'trfc' },
    { label: 'Video Views', value: 'vv' },
  ],
  LinkedIn: [
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Brand Awareness', value: 'awr' },
    { label: 'Website Visits (Traffic)', value: 'trfc' },
    { label: 'Engagement', value: 'eng' },
    { label: 'Video Views', value: 'vv' },
  ],
}

const adTypesByPlatform: Record<string, { label: string; value: string }[]> = {
  Facebook: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
    { label: 'Dynamic Creative Ad (DCO)', value: 'dyn' },
    { label: 'GIF', value: 'gif' },
  ],
  'Google Ads': [
    { label: 'Responsive Search Ad', value: 'rsa' },
    { label: 'Call Ad', value: 'call' },
    { label: 'Dynamic Search Ad', value: 'dsa' },
    { label: 'Video Ad', value: 'vid' },
    { label: 'Responsive Display Ad', value: 'rda' },
    { label: 'Discovery Carousel Ad', value: 'dca' },
    { label: 'Discovery Ad', value: 'disco' },
    { label: 'Bumper Ads (6s)', value: 'bmp' },
    { label: 'Skippable In-Stream Ads', value: 'skr' },
    { label: 'Non-skippable In-Stream Ads', value: 'nsk' },
    { label: 'TrueView Ads', value: 'tvw' },
    { label: 'Shorts Ads', value: 'shr' },
  ],
  'Microsoft Ads': [
    { label: 'Expanded Text Ad', value: 'xta' },
    { label: 'Responsive Search Ads', value: 'rsa' },
    { label: 'Dynamic Search Ads', value: 'dsa' },
    { label: 'Bing Smart Search Ads', value: 'bss' },
    { label: 'Audience Ads', value: 'aud' },
    { label: 'Multimedia Ads', value: 'mmd' },
  ],
  TikTok: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Spark Ads', value: 'spk' },
    { label: 'Carousel Ads', value: 'car' },
  ],
  LinkedIn: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'car' },
    { label: 'Text', value: 'txt' },
    { label: 'Conversation', value: 'con' },
    { label: 'Spotlight', value: 'spt' },
    { label: 'Message', value: 'msg' },
  ],
}

const countryOptions = [
  { label: 'All', value: 'all' },
  { label: 'United States', value: 'us' },
  { label: 'Israel', value: 'il' },
  { label: 'Austria', value: 'at' },
  { label: 'Belgium', value: 'be' },
  { label: 'Bulgaria', value: 'bg' },
  { label: 'Croatia', value: 'hr' },
  { label: 'Cyprus', value: 'cy' },
  { label: 'Czechia', value: 'cz' },
  { label: 'Denmark', value: 'dk' },
  { label: 'Estonia', value: 'ee' },
  { label: 'Finland', value: 'fi' },
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' },
  { label: 'Greece', value: 'el' },
  { label: 'Hungary', value: 'hu' },
  { label: 'Ireland', value: 'ie' },
  { label: 'Italy', value: 'it' },
  { label: 'Latvia', value: 'lv' },
  { label: 'Lithuania', value: 'lt' },
  { label: 'Luxembourg', value: 'lu' },
  { label: 'Malta', value: 'mt' },
  { label: 'Netherlands', value: 'nl' },
  { label: 'Poland', value: 'pl' },
  { label: 'Portugal', value: 'pt' },
  { label: 'Romania', value: 'ro' },
  { label: 'Slovakia', value: 'sk' },
  { label: 'Slovenia', value: 'si' },
  { label: 'Spain', value: 'es' },
  { label: 'Sweden', value: 'se' },
]

export default function Home() {
  // Inputs
  const [platform, setPlatform] = useState('')
  const [product, setProduct] = useState('')
  const [campType, setCampType] = useState('')
  const [campTheme, setCampTheme] = useState('')
  const [campDate, setCampDate] = useState('')

  const [adSetTheme, setAdSetTheme] = useState('')
  const [targeting, setTargeting] = useState('')
  const [countries, setCountries] = useState<string[]>([])
  const [stateZip, setStateZip] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [gender, setGender] = useState('')
  const [language, setLanguage] = useState('')
  const [matchType, setMatchType] = useState('')
  const [adsetDate, setAdsetDate] = useState('')

  const [adType, setAdType] = useState('')
  const [adTheme, setAdTheme] = useState('')
  const [adDate, setAdDate] = useState('')

  // Outputs
  const [campaignName, setCampaignName] = useState('na_na_na')
  const [adSetName, setAdSetName] = useState('na')
  const [adName, setAdName] = useState('na')
  const [utmString, setUtmString] = useState('')
  const [finalUrl, setFinalUrl] = useState('')

  // Real-time name generation
  useEffect(() => {
    const seg = (val: string) =>
      (sanitizeText(val) || 'na').replace(/\s+/g, '+')

    const prodSeg = seg(product)
    const typeSeg = campType || 'na'
    const themeSeg = campTheme ? seg(campTheme) : 'na'

    // Campaign Name
    setCampaignName(`${prodSeg}_${typeSeg}_${themeSeg}`)

    // Ad Set Name
    const countrySeg = countries.length ? countries.join('-') : 'na'
    const stateSeg = stateZip ? seg(stateZip) : 'na'
    const ageSeg = `${ageMin || 'na'}-${ageMax || 'na'}`
    const genderSeg = gender || 'na'
    const langSeg = language || 'na'
    const matchSeg = matchType || 'na'
    const adsetDateSeg = adsetDate ? formatToDDMMYY(adsetDate) : 'na'
    const adsetThemeSeg = adSetTheme ? seg(adSetTheme) : 'na'

    setAdSetName(
      [
        prodSeg,
        typeSeg,
        countrySeg,
        stateSeg,
        ageSeg,
        genderSeg,
        langSeg,
        matchSeg,
        adsetDateSeg,
        adsetThemeSeg,
      ].join('_')
    )

    // Ad Name
    const adTypeSeg = adType || 'na'
    const adDateSeg = adDate ? formatToDDMMYY(adDate) : 'na'
    const adThemeSeg = adTheme ? seg(adTheme) : 'na'

    setAdName(
      [prodSeg, typeSeg, adTypeSeg, adDateSeg, adThemeSeg].join('_')
    )
  }, [
    product,
    campType,
    campTheme,
    adSetTheme,
    targeting,
    countries,
    stateZip,
    ageMin,
    ageMax,
    gender,
    language,
    matchType,
    adsetDate,
    adType,
    adTheme,
    adDate,
  ])

  // UTM Generation
  const generateUTM = () => {
    if (!platform) {
      // toast notification
      return
    }
    let utm = ''
    switch (platform) {
      case 'Facebook':
        utm =
          'utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}' +
          '&utm_adset={{adset.name}}&utm_ad={{ad.name}}' +
          '&cid={{campaign.id}}&asid={{adset.id}}&aid={{ad.id}}' +
          '&fsource={{site_source_name}}&placement={{placement}}'
        break
      case 'Google Ads':
        utm =
          '{lpurl}?utm_source=google&utm_medium=cpc' +
          '&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}' +
          '&utm_ad={{ad.name}}&utm_term={keyword}&adpos={adposition}' +
          '&device={device}&creative={creative}&placement={placement}' +
          '&cid={campaignid}&asid={adgroupid}' +
          '&kmt={matchtype}&net={network}&device_model={devicemodel}' +
          '&target={targetid}'
        break
      case 'Microsoft Ads':
        utm =
          '{lpurl}?utm_source=bing&utm_medium=cpc' +
          '&cid={CampaignId}&utm_campaign={Campaign}' +
          '&asid={AdGroupId}&utm_adset={AdGroup}' +
          '&aid={AdId}&kmt={MatchType}' +
          '&utm_term={keyword:default}-{QueryString}' +
          '&target={TargetId}&net={Network}&device={Device}'
        break
      case 'TikTok':
        utm =
          'utm_source=tiktok&utm_medium=paid' +
          '&utm_campaign=__CAMPAIGN_NAME__&utm_adset=__AID_NAME__' +
          '&utm_ad=__CID_NAME__&cid=__CAMPAIGN_ID__' +
          '&asid=__AID__&aid=__CID__' +
          '&placement=__PLACEMENT__&ttclid=__CLICKID__'
        break
      case 'LinkedIn':
        utm =
          'utm_source=linkedin&utm_medium=paid_social' +
          '&utm_campaign={{campaign.name}}&utm_content={{ad.name}}' +
          '&account_id={{ACCOUNT_ID}}' +
          '&account_name={{ACCOUNT_NAME}}' +
          '&campaign_id={{CAMPAIGN_ID}}' +
          '&campaign_group_id={{CAMPAIGN_GROUP_ID}}' +
          '&creative_id={{CREATIVE_ID}}'
        break
    }
    setUtmString(utm)
  }

  // Final URL Generation
  const generateURL = () => {
    const lp = (document.getElementById(
      'landing-page'
    ) as HTMLInputElement).value
    const sep = lp.includes('?') ? '&' : '?'
    setFinalUrl(lp + sep + utmString)
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-2 gap-8">
      {/* Left column */}
      <div className="space-y-6">
        {/* Campaign Name */}
        <div className="card">
          <h3 className="text-green-500 mb-4">Campaign Name</h3>
          <label className="block mb-1">
            Platform <span>ⓘ</span>
          </label>
          <select
            className="input"
            value={platform}
            onChange={e => {
              setPlatform(e.target.value)
              setCampType('')
              setAdType('')
            }}
          >
            <option value="">Select platform</option>
            {Object.keys(campaignTypesByPlatform).map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <label className="block mt-4 mb-1">
            Product <span>ⓘ</span>
          </label>
          <input
            className="input"
            placeholder="Enter product"
            value={product}
            onChange={e => setProduct(e.target.value)}
          />

          <label className="block mt-4 mb-1">
            Campaign Type <span>ⓘ</span>
          </label>
          <select
            className="input"
            value={campType}
            onChange={e => setCampType(e.target.value)}
            disabled={!platform}
          >
            <option value="">
              {platform ? 'Select type' : 'Select platform first'}
            </option>
            {platform &&
              campaignTypesByPlatform[platform].map(ct => (
                <option key={ct.value} value={ct.value}>
                  {ct.value}
                </option>
              ))}
          </select>

          <label className="block mt-4 mb-1">
            Campaign Theme <span>(optional)</span> <span>ⓘ</span>
          </label>
          <input
            className="input"
            placeholder="Enter theme"
            value={campTheme}
            onChange={e => setCampTheme(e.target.value)}
          />

          <label className="block mt-4 mb-1">
            Campaign Date <span>(optional)</span> <span>ⓘ</span>
          </label>
          <input
            type="date"
            className="input"
            placeholder="dd/mm/yyyy"
            value={campDate}
            onChange={e => setCampDate(e.target.value)}
          />
        </div>

        {/* Ad Set Name */}
        <div className="card">
          <h3 className="text-green-500 mb-4">Ad Set Name</h3>
          <label className="block mb-1">
            Ad Set Theme <span>(optional)</span> <span>ⓘ</span>
          </label>
          <input
            className="input"
            placeholder="Enter ad set theme"
            value={adSetTheme}
            onChange={e => setAdSetTheme(e.target.value)}
          />

          <label className="block mt-4 mb-1">
            Targeting Type <span>ⓘ</span>
          </label>
          <select
            className="input"
            value={targeting}
            onChange={e => setTargeting(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="lal">lal</option>
            <option value="rem">rem</option>
            <option value="wide">wide</option>
          </select>

          <label className="block mt-4 mb-1">
            Countries <span>ⓘ</span>
          </label>
          <select
            multiple
            className="input h-32"
            value={countries}
            onChange={e =>
              setCountries(
                Array.from(e.target.selectedOptions).map(o => o.value)
              )
            }
          >
            {countryOptions.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label className="block mt-4 mb-1">
            State/City/Zip <span>ⓘ</span>
          </label>
          <input
            className="input"
            placeholder="Enter State/City/Zip"
            value={stateZip}
            onChange={e => setStateZip(e.target.value)}
          />

          {/* Age */}
          <label className="block mt-4 mb-1">Age <span>ⓘ</span></label>
          <div className="flex space-x-4">
            <select
              className="input flex-1"
              value={ageMin}
              onChange={e => setAgeMin(e.target.value)}
            >
              <option value="">Min</option>
              {[...Array(48).keys()]
                .map(n => 18 + n)
                .concat(['65+'])
                .map(v => (
                  <option key={v}>{v}</option>
                ))}
            </select>
            <select
              className="input flex-1"
              value={ageMax}
              onChange={e => setAgeMax(e.target.value)}
            >
              <option value="">Max</option>
              {[...Array(48).keys()]
                .map(n => 18 + n)
                .concat(['65+'])
                .map(v => (
                  <option key={v}>{v}</option>
                ))}
            </select>
          </div>

          {/* Gender & Language */}
          <div className="mt-4 flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1">Gender <span>ⓘ</span></label>
              <select
                className="input w-full"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="all">all</option>
                <option value="f">f</option>
                <option value="m">m</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">Language <span>ⓘ</span></label>
              <select
                className="input w-full"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="">Select language</option>
                <option value="all">all</option>
                <option value="en">en</option>
                <option value="es">es</option>
                <option value="ro">ro</option>
                <option value="ar">ar</option>
                <option value="ru">ru</option>
                <option value="de">de</option>
                <option value="pt">pt</option>
              </select>
            </div>
          </div>

          <label className="block mt-4 mb-1">
            Match Type <span>(optional)</span> <span>ⓘ</span>
          </label>
          <select
            className="input"
            value={matchType}
            onChange={e => setMatchType(e.target.value)}
          >
            <option value="">na</option>
            <option value="exact">exact</option>
            <option value="phrase">phrase</option>
            <option value="broad">broad</option>
          </select>

          <label className="block mt-4 mb-1">
            Ad Set Date <span>(optional)</span> <span>ⓘ</span>
          </label>
          <input
            type="date"
            className="input"
            value={adsetDate}
            onChange={e => setAdsetDate(e.target.value)}
          />
        </div>

        {/* Ad Name */}
        <div className="card">
          <h3 className="text-green-500 mb-4">Ad Name</h3>
          <label className="block mb-1">
            Ad Type <span>ⓘ</span>
          </label>
          <select
            className="input"
            value={adType}
            onChange={e => setAdType(e.target.value)}
            disabled={!platform}
          >
            <option value="">
              {platform ? 'Select ad type' : 'Select platform first'}
            </option>
            {platform &&
              adTypesByPlatform[platform].map(at => (
                <option key={at.value} value={at.value}>
                  {at.value}
                </option>
              ))}
          </select>

          <label className="block mt-4 mb-1">
            Ad Theme <span>ⓘ</span>
          </label>
          <input
            className="input"
            placeholder="Enter ad theme"
            value={adTheme}
            onChange={e => setAdTheme(e.target.value)}
          />

          <label className="block mt-4 mb-1">
            Ad Date <span>ⓘ</span>
          </label>
          <input
            type="date"
            className="input"
            value={adDate}
            onChange={e => setAdDate(e.target.value)}
          />
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Final Result */}
        <div className="card">
          <h3 className="text-green-500 mb-4">Final Result</h3>
          <div className="mb-3">
            <strong className="block">Campaign Name</strong>
            <div>
              {campaignName}{' '}
              <button className="btn-sm">Copy</button>
            </div>
          </div>
          <div className="mb-3">
            <strong className="block">Ad Set Name</strong>
            <div>
              {adSetName}{' '}
              <button className="btn-sm">Copy</button>
            </div>
          </div>
          <div>
            <strong className="block">Ad Name</strong>
            <div>
              {adName}{' '}
              <button className="btn-sm">Copy</button>
            </div>
          </div>
        </div>

        {/* UTM Generator */}
        <div className="card">
          <h3 className="text-green-500 mb-4">UTM Generator</h3>
          <div className="bg-gray-700 p-3 rounded mb-3 break-all">
            {utmString || 'No UTM generated yet.'}
          </div>
          <div className="flex space-x-4">
            <button className="btn" onClick={generateUTM}>
              Generate
            </button>
            <button className="btn" onClick={() => {/* copy utmString */}}>
              Copy
            </button>
          </div>
        </div>

        {/* Landing Page URL */}
        <div className="card">
          <h3 className="text-green-500 mb-4">Landing Page URL</h3>
          <input
            id="landing-page"
            className="input mb-3"
            placeholder="https://www.cnn.com/"
          />
          <div className="flex space-x-4">
            <button className="btn" onClick={generateURL}>
              Generate
            </button>
            <button className="btn" onClick={() => {/* copy finalUrl */}}>
              Copy
            </button>
          </div>
          <div className="bg-gray-700 p-3 rounded mt-3 break-all">
            {finalUrl || 'Your URL + UTM will appear here.'}
          </div>
        </div>
      </div>
    </div>
  )
}
