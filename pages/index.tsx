// pages/index.tsx
import { useState, useEffect } from 'react'
import sanitizeText from '../utils/sanitizeText'
import formatToDDMMYY from '../utils/formatToDDMMYY'

const PLATFORMS = ['Facebook', 'Google Ads', 'Microsoft Ads', 'TikTok', 'LinkedIn'] as const

const CAMPAIGN_TYPES: Record<string, { label: string; value: string }[]> = {
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

const AD_TYPES: Record<string, { label: string; value: string }[]> = {
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
    { label: 'Masthead Ads', value: 'mast' },
    { label: 'In-feed Ads', value: 'infd' },
    { label: 'Bumper Ads', value: 'bmp' },
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
    { label: 'Carousel Ads', value: 'crsel' },
  ],
  LinkedIn: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
    { label: 'Text', value: 'txt' },
    { label: 'Conversation', value: 'con' },
    { label: 'Spotlight', value: 'spt' },
    { label: 'Message', value: 'msg' },
  ],
}

const COUNTRIES = [
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

const TARGETING = [
  { label: 'Lookalike', value: 'lal' },
  { label: 'Remarketing', value: 'rem' },
  { label: 'Wide', value: 'wide' },
]

const GENDERS = [
  { label: 'All', value: 'all' },
  { label: 'Female', value: 'f' },
  { label: 'Male', value: 'm' },
]

const LANGUAGES = [
  { label: 'All', value: 'all' },
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'Hebrew', value: 'he' },
]

const MATCH_TYPES = [
  { label: 'na', value: 'na' },
  { label: 'Exact', value: 'exact' },
  { label: 'Phrase', value: 'phrase' },
  { label: 'Broad', value: 'broad' },
]

const AGE_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => `${18 + i}`).concat(['65+'])

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
  const [scz, setScz] = useState('')
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
  const [utm, setUtm] = useState('')
  const [finalUrl, setFinalUrl] = useState('')
  const [notif, setNotif] = useState('')

  // Generate names
  useEffect(() => {
    const seg = (val: string) => (sanitizeText(val) || 'na').replace(/\s+/g, '+')
    const p = seg(product)
    const t = campType || 'na'
    const th = campTheme ? seg(campTheme) : 'na'
    setCampaignName([p, t, th].join('_'))

    const cc = countries.length ? countries.join('-') : 'na'
    const s = scz ? seg(scz) : 'na'
    const a = `${ageMin || 'na'}-${ageMax || 'na'}`
    const g = gender || 'na'
    const l = language || 'na'
    const m = matchType || 'na'
    const adsd = adsetDate ? formatToDDMMYY(adsetDate) : 'na'
    const ast = adSetTheme ? seg(adSetTheme) : 'na'
    setAdSetName([p, t, cc, s, a, g, l, m, adsd, ast].join('_'))

    const adt = adType || 'na'
    const add = adDate ? formatToDDMMYY(adDate) : 'na'
    const adh = adTheme ? seg(adTheme) : 'na'
    setAdName([p, t, adt, add, adh].join('_'))
  }, [
    product, campType, campTheme,
    adSetTheme, countries, scz, ageMin, ageMax, gender, language, matchType, adsetDate,
    adType, adDate, adTheme,
  ])

  // UTM gen
  const genUtm = () => {
    if (!platform) {
      setNotif('Please choose Platform')
      return setTimeout(() => setNotif(''), 2500)
    }
    let s = ''
    switch (platform) {
      case 'Facebook':
        s = `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_ad={{ad.name}}&cid={{campaign.id}}&asid={{adset.id}}&aid={{ad.id}}&fsource={{site_source_name}}&placement={{placement}}`
        break
      case 'Google Ads':
        s = `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_adset={_adset}&utm_ad={_ad}&utm_term={keyword}&adpos={adposition}&device={device}&creative={creative}&placement={placement}&cid={campaignid}&asid={adgroupid}&kmt={matchtype}&net={network}&device_model={devicemodel}&target={targetid}`
        break
      case 'Microsoft Ads':
        s = `{lpurl}?utm_source=bing&utm_medium=cpc&cid={CampaignId}&utm_campaign={Campaign}&asid={AdGroupId}&utm_adset={AdGroup}&aid={AdId}&kmt={MatchType}&utm_term={keyword:default}-{QueryString}&target={TargetId}&net={Network}&device={Device}`
        break
      case 'TikTok':
        s = `utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_NAME__&utm_adset=__AID_NAME__&utm_ad=__CID_NAME__&cid=__CAMPAIGN_ID__&asid=__AID__&aid=__CID__&placement=__PLACEMENT__&ttclid=__CLICKID__`
        break
      case 'LinkedIn':
        s = `utm_source=linkedin&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`
        break
    }
    setUtm(s)
  }

  const genUrl = () => {
    const base = (document.getElementById('landing-page') as HTMLInputElement).value.trim()
    if (!base) {
      setNotif('Please enter Landing Page URL')
      return setTimeout(() => setNotif(''), 2500)
    }
    const sep = base.includes('?') ? '&' : '?'
    setFinalUrl(`${base}${sep}${utm}`)
  }

  return (
    <div className="container mx-auto p-6 grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Campaign */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-xl font-semibold">Campaign Name</h3>
          {/* Platform */}
          <div>
            <label className="block text-gray-200 mb-1">Platform ⓘ</label>
            <select
              className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              value={platform}
              onChange={e => {
                setPlatform(e.target.value)
                setCampType('')
                setAdType('')
              }}
            >
              <option value="">Select platform</option>
              {PLATFORMS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          {/* Product */}
          <div>
            <label className="block text-gray-200 mb-1">Product ⓘ</label>
            <input
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 rounded-md border border-gray-600 p-2"
              placeholder="Enter product"
              value={product}
              onChange={e => setProduct(e.target.value)}
            />
          </div>
          {/* Campaign Type */}
          <div>
            <label className="block text-gray-200 mb-1">Campaign Type ⓘ</label>
            <select
              className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              disabled={!platform}
              value={campType}
              onChange={e => setCampType(e.target.value)}
            >
              <option value="">
                {platform ? 'Select campaign type' : 'Select platform first'}
              </option>
              {platform && CAMPAIGN_TYPES[platform].map(o => (
                <option key={o.value} value={o.value}>{o.value}</option>
              ))}
            </select>
          </div>
          {/* Theme & Date */}
          <div>
            <label className="block text-gray-200 mb-1">
              Campaign Theme (optional) ⓘ
            </label>
            <input
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 rounded-md border border-gray-600 p-2"
              placeholder="Enter theme"
              value={campTheme}
              onChange={e => setCampTheme(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">
              Campaign Date (optional) ⓘ
            </label>
            <input
              type="date"
              className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              value={campDate}
              onChange={e => setCampDate(e.target.value)}
            />
          </div>
        </div>

        {/* Ad Set */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-xl font-semibold">Ad Set Name</h3>
          <div>
            <label className="block text-gray-200 mb-1">
              Ad Set Theme (optional) ⓘ
            </label>
            <input
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 rounded-md border border-gray-600 p-2"
              placeholder="Enter ad set theme"
              value={adSetTheme}
              onChange={e => setAdSetTheme(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Targeting type ⓘ</label>
            <select
              className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              value={targeting}
              onChange={e => setTargeting(e.target.value)}
            >
              <option value="">Select type</option>
              {TARGETING.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Countries ⓘ</label>
            <select
              multiple
              className="w-full h-32 bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              value={countries}
              onChange={e =>
                setCountries(Array.from(e.target.selectedOptions, o => o.value))
              }
            >
              {COUNTRIES.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-200 mb-1">
              State/City/Zip(s) (optional) ⓘ
            </label>
            <input
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 rounded-md border border-gray-600 p-2"
              placeholder="e.g. CA-LosAngeles-90001"
              value={scz}
              onChange={e => setScz(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Age ⓘ</label>
            <div className="flex space-x-4">
              <select
                className="flex-1 bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
                value={ageMin}
                onChange={e => setAgeMin(e.target.value)}
              >
                <option value="">Min</option>
                {AGE_OPTIONS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <select
                className="flex-1 bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
                value={ageMax}
                onChange={e => setAgeMax(e.target.value)}
              >
                <option value="">Max</option>
                {AGE_OPTIONS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-200 mb-1">Gender ⓘ</label>
              <select
                className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                {GENDERS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-200 mb-1">Language ⓘ</label>
              <select
                className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="">Select language</option>
                {LANGUAGES.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Match Type ⓘ</label>
            <select
              className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              value={matchType}
              onChange={e => setMatchType(e.target.value)}
            >
              <option value="">Select match type</option>
              {MATCH_TYPES.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-200 mb-1">
              Ad Set Date (optional) ⓘ
            </label>
            <input
              type="date"
              className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              value={adsetDate}
              onChange={e => setAdsetDate(e.target.value)}
            />
          </div>
        </div>

        {/* Ad */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-xl font-semibold">Ad Name</h3>
          <div>
            <label className="block text-gray-200 mb-1">Ad Type ⓘ</label>
            <select
              className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              disabled={!platform}
              value={adType}
              onChange={e => setAdType(e.target.value)}
            >
              <option value="">
                {platform ? 'Select ad type' : 'Select platform first'}
              </option>
              {platform && AD_TYPES[platform].map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Ad Theme ⓘ</label>
            <input
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 rounded-md border border-gray-600 p-2"
              placeholder="Enter ad theme"
              value={adTheme}
              onChange={e => setAdTheme(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Ad Date ⓘ</label>
            <input
              type="date"
              className="w-full bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
              value={adDate}
              onChange={e => setAdDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Final Result */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-xl font-semibold">Final Result</h3>
          <div className="space-y-2">
            <div>
              <p className="text-gray-400">Campaign Name</p>
              <div className="flex items-center space-x-2">
                <code className="break-all text-gray-200">{campaignName}</code>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded-md"
                  onClick={() => {
                    navigator.clipboard.writeText(campaignName)
                    setNotif('Copied!')
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <p className="text-gray-400">Ad Set Name</p>
              <div className="flex items-center space-x-2">
                <code className="break-all text-gray-200">{adSetName}</code>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded-md"
                  onClick={() => {
                    navigator.clipboard.writeText(adSetName)
                    setNotif('Copied!')
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <p className="text-gray-400">Ad Name</p>
              <div className="flex items-center space-x-2">
                <code className="break-all text-gray-200">{adName}</code>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded-md"
                  onClick={() => {
                    navigator.clipboard.writeText(adName)
                    setNotif('Copied!')
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* UTM */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-xl font-semibold">UTM Generator</h3>
          <textarea
            readOnly
            className="w-full h-24 bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
            placeholder="No UTM generated yet."
            value={utm}
          />
          <div className="flex space-x-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={genUtm}
            >
              Generate
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                navigator.clipboard.writeText(utm)
                setNotif('Copied!')
              }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Final URL */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-xl font-semibold">Landing Page URL</h3>
          <input
            id="landing-page"
            className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 rounded-md border border-gray-600 p-2"
            placeholder="https://www.cnn.com/"
          />
          <textarea
            readOnly
            className="w-full h-24 bg-gray-700 text-gray-200 rounded-md border border-gray-600 p-2"
            placeholder="URL + UTM"
            value={finalUrl}
          />
          <div className="flex space-x-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={genUrl}
            >
              Generate
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                navigator.clipboard.writeText(finalUrl)
                setNotif('Copied!')
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notif && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          {notif}
        </div>
      )}
    </div>
  )
}
