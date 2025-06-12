// pages/index.tsx
import { useState, useEffect } from 'react'
import sanitizeText from '../utils/sanitizeText'
import formatToDDMMYY from '../utils/formatToDDMMYY'
import copy from 'copy-to-clipboard'

const platformOptions = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Google Ads', value: 'google_ads' },
  { label: 'Microsoft Ads', value: 'microsoft_ads' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'LinkedIn', value: 'linkedin' },
]

const campaignTypesByPlatform: Record<string, { label: string; value: string }[]> = {
  facebook: [
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
  google_ads: [
    { label: 'Search', value: 'srch' },
    { label: 'Display / GDN', value: 'gdn' },
    { label: 'Discovery', value: 'disc' },
    { label: 'Performance Max', value: 'pmax' },
    { label: 'YouTube (video)', value: 'yt' },
  ],
  microsoft_ads: [
    { label: 'Search', value: 'srch' },
    { label: 'Audience Ads / MAN', value: 'man' },
    { label: 'Smart Search Campaign', value: 'smrt' },
  ],
  tiktok: [
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Reach', value: 'reach' },
    { label: 'Traffic', value: 'trfc' },
    { label: 'Video Views', value: 'vv' },
  ],
  linkedin: [
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Brand Awareness', value: 'awr' },
    { label: 'Website Visits (Traffic)', value: 'trfc' },
    { label: 'Engagement', value: 'eng' },
    { label: 'Video Views', value: 'vv' },
  ],
}

const adTypesByPlatform: Record<string, { label: string; value: string }[]> = {
  facebook: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
    { label: 'Dynamic Creative Ad (DCO)', value: 'dyn' },
    { label: 'GIF', value: 'gif' },
  ],
  google_ads: [
    { label: 'Responsive Search Ad', value: 'rsa' },
    { label: 'Call Ad', value: 'call' },
    { label: 'Dynamic Search Ad', value: 'dsa' },
    { label: 'Video Ad', value: 'vid' },
    { label: 'Responsive Display Ad', value: 'rda' },
    { label: 'Discovery Carousel Ad', value: 'dca' },
    { label: 'Discovery Ad', value: 'disco' },
    { label: 'Masthead Ads', value: 'mast' },
    { label: 'In-feed Ads', value: 'infd' },
    { label: 'Bumper Ads (6s)', value: 'bmp' },
    { label: 'Skippable In-Stream Ads', value: 'skr' },
    { label: 'Non-skippable In-Stream Ads', value: 'nsk' },
    { label: 'TrueView Ads', value: 'tvw' },
    { label: 'Shorts Ads', value: 'shr' },
  ],
  microsoft_ads: [
    { label: 'Expanded Text Ad', value: 'xta' },
    { label: 'Responsive Search Ads', value: 'rsa' },
    { label: 'Dynamic Search Ads', value: 'dsa' },
    { label: 'Bing Smart Search Ads', value: 'bss' },
    { label: 'Audience Ads', value: 'aud' },
    { label: 'Multimedia Ads', value: 'mmd' },
  ],
  tiktok: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Spark Ads', value: 'spk' },
    { label: 'Carousel Ads', value: 'crsel' },
  ],
  linkedin: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
    { label: 'Text', value: 'txt' },
    { label: 'Conversation', value: 'con' },
    { label: 'Spotlight', value: 'spt' },
    { label: 'Message', value: 'msg' },
  ],
}

const countryList = [
  'All','United States','Israel','Austria','Belgium','Bulgaria','Croatia',
  'Cyprus','Czechia','Denmark','Estonia','Finland','France','Germany','Greece',
  'Hungary','Ireland','Italy','Latvia','Lithuania','Luxembourg','Malta','Netherlands',
  'Poland','Portugal','Romania','Slovakia','Slovenia','Spain','Sweden'
] as const

const genders = [
  { label: 'All', value: 'all' },
  { label: 'Female/Woman', value: 'f' },
  { label: 'Man/Male', value: 'm' },
]

const languages = [
  { label: 'All', value: 'all' },
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'Hebrew', value: 'he' },
  { label: 'French', value: 'fr' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Russian', value: 'ru' },
  { label: 'German', value: 'de' },
  { label: 'Portuguese', value: 'pt' },
]

export default function Home() {
  // inputs
  const [platform, setPlatform] = useState<string>('')
  const [product, setProduct] = useState('')
  const [campType, setCampType] = useState('')
  const [campDate, setCampDate] = useState('')
  const [campTheme, setCampTheme] = useState('')

  const [adsetTheme, setAdsetTheme] = useState('')
  const [targeting, setTargeting] = useState('')
  const [countries, setCountries] = useState<string[]>(['All'])
  const [stateZip, setStateZip] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [gender, setGender] = useState('')
  const [language, setLanguage] = useState('')
  const [matchType, setMatchType] = useState('')
  const [adsetDate, setAdsetDate] = useState('')

  const [adType, setAdType] = useState('')
  const [adDate, setAdDate] = useState('')
  const [adTheme, setAdTheme] = useState('')

  // outputs
  const [campaignName, setCampaignName] = useState('na_na_na')
  const [adSetName, setAdSetName] = useState('na')
  const [adName, setAdName] = useState('na')
  const [utmString, setUtmString] = useState('No UTM generated yet.')
  const [finalUrl, setFinalUrl] = useState('')

  // utility to sanitize + default
  const seg = (v: string) =>
    (sanitizeText(v) || 'na').replace(/\s+/g, '+')

  useEffect(() => {
    // campaign name = product, type, theme, date
    const pr = seg(product)
    const tp = campType || 'na'
    const dt = campDate ? formatToDDMMYY(campDate) : 'na'
    const th = campTheme ? seg(campTheme) : 'na'
    setCampaignName(`${pr}_${tp}_${dt}_${th}`)

    // adset name = product, type, countries, stateZip, age, gender, language, match, date, theme
    const ct = targeting || 'na'
    const cs = countries.length ? countries.map(c=> seg(c)).join('-') : 'na'
    const sz = stateZip ? seg(stateZip) : 'na'
    const ag = `${ageMin||'na'}-${ageMax||'na'}`
    const gd = gender||'na'
    const lg = language||'na'
    const mt = matchType||'na'
    const adDateSeg = adsetDate ? formatToDDMMYY(adsetDate) : 'na'
    const asTh = adsetTheme ? seg(adsetTheme) : 'na'
    setAdSetName([
      pr,tp,cs,sz,ag,gd,lg,mt,adDateSeg,asTh
    ].join('_'))

    // ad name = product, type, adType, date, theme
    const at = adType||'na'
    const adDt = adDate ? formatToDDMMYY(adDate) : 'na'
    const adTh = adTheme ? seg(adTheme) : 'na'
    setAdName(`${pr}_${tp}_${at}_${adDt}_${adTh}`)
  }, [
    product, campType, campDate, campTheme,
    targeting, countries, stateZip, ageMin, ageMax,
    gender, language, matchType, adsetDate, adsetTheme,
    adType, adDate, adTheme
  ])

  // UTM Generator
  function generateUTM() {
    if (!platform) {
      alert('Please choose Platform')
      return
    }
    let utm = ''
    switch(platform) {
      case 'facebook':
        utm = `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_ad={{ad.name}}&cid={{campaign.id}}&asid={{adset.id}}&aid={{ad.id}}&fsource={{site_source_name}}&placement={{placement}}`
        break
      case 'google_ads':
        utm = `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_adset={_adset}&utm_ad={_ad}&utm_term={keyword}&adpos={adposition}&device={device}&creative={creative}&placement={placement}&cid={campaignid}&asid={adgroupid}&kmt={matchtype}&net={network}&device_model={devicemodel}&target={targetid}`
        break
      case 'microsoft_ads':
        utm = `{lpurl}?utm_source=bing&utm_medium=cpc&cid={CampaignId}&utm_campaign={Campaign}&asid={AdGroupId}&utm_adset={AdGroup}&aid={AdId}&kmt={MatchType}&utm_term={keyword:default}-{QueryString}&target={TargetId}&net={Network}&device={Device}`
        break
      case 'tiktok':
        utm = `utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_NAME__&utm_adset=__ADSET_NAME__&utm_ad=__AD_NAME__&cid=__CAMPAIGN_ID__&asid=__ADSET_ID__&aid=__AD_ID__&placement=__PLACEMENT__&ttclid=__CLICKID__`
        break
      case 'linkedin':
        utm = `utm_source=linkedin&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&account_id={{ACCOUNT_ID}}&account_name={{ACCOUNT_NAME}}&campaign_id={{CAMPAIGN_ID}}&campaign_group_id={{CAMPAIGN_GROUP_ID}}&creative_id={{CREATIVE_ID}}`
        break
    }
    setUtmString(utm)
  }

  // Final URL
  function generateURL() {
    const inp = document.getElementById('landing-page') as HTMLInputElement
    if (!inp.value) {
      alert('Please enter Landing Page URL')
      return
    }
    const sep = inp.value.includes('?') ? '&' : '?'
    setFinalUrl(`${inp.value}${sep}${utmString}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* LEFT: INPUT CARDS */}
        <div className="space-y-8">
          {/* Campaign Name */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-green-500 text-xl font-semibold">Campaign Name</h2>
            {/* Platform */}
            <label className="block">
              <span className="text-sm">Platform ⓘ</span>
              <select
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                value={platform}
                onChange={(e)=>{ setPlatform(e.target.value); setCampType('') }}
              >
                <option value="">Select platform</option>
                {platformOptions.map(p=>(
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </label>
            {/* Product */}
            <label className="block">
              <span className="text-sm">Product ⓘ</span>
              <input
                type="text"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                placeholder="Enter product"
                value={product}
                onChange={e=>setProduct(e.target.value)}
              />
            </label>
            {/* Campaign Type */}
            <label className="block">
              <span className="text-sm">Campaign Type ⓘ</span>
              <select
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                disabled={!platform}
                value={campType}
                onChange={e=>setCampType(e.target.value)}
              >
                <option value="">{ platform ? 'Select type' : 'Select platform first'}</option>
                {platform && campaignTypesByPlatform[platform]?.map(ct=>(
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </label>
            {/* Campaign Date */}
            <label className="block relative">
              <span className="text-sm">Campaign Date (optional) ⓘ</span>
              <input
                type="date"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 pr-10"
                placeholder="dd/mm/yyyy"
                value={campDate}
                onChange={e=>setCampDate(e.target.value)}
              />
              <svg className="w-5 h-5 absolute right-3 bottom-3 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20"><path d="M..." /></svg>
            </label>
            {/* Campaign Theme */}
            <label className="block">
              <span className="text-sm">Campaign Theme (optional) ⓘ</span>
              <input
                type="text"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                placeholder="Enter theme"
                value={campTheme}
                onChange={e=>setCampTheme(e.target.value)}
              />
            </label>
          </div>

          {/* Ad Set Name */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-green-500 text-xl font-semibold">Ad Set Name</h2>

            <label className="block">
              <span className="text-sm">Ad Set Theme (optional) ⓘ</span>
              <input
                type="text"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                placeholder="Enter ad set theme"
                value={adsetTheme}
                onChange={e=>setAdsetTheme(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm">Targeting type ⓘ</span>
              <select
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                value={targeting}
                onChange={e=>setTargeting(e.target.value)}
              >
                <option value="">Select type</option>
                <option value="lal">Lookalike</option>
                <option value="rem">Remarketing</option>
                <option value="wide">Wide</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm">Countries ⓘ</span>
              <select
                multiple
                size={7}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                value={countries}
                onChange={e=>{
                  const opts = Array.from(e.target.selectedOptions).map(o=>o.value)
                  setCountries(opts)
                }}
              >
                {countryList.map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm">State/City/Zip(s) (optional) ⓘ</span>
              <input
                type="text"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                placeholder="e.g. CA-LosAngeles-90001"
                value={stateZip}
                onChange={e=>setStateZip(e.target.value)}
              />
            </label>

            {/* Age */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block"><span className="text-sm">Age ⓘ</span></label>
                <select
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  value={ageMin}
                  onChange={e=>setAgeMin(e.target.value)}
                >
                  <option value="">Min</option>
                  {[...Array(48).keys()].map(n=>(
                    <option key={n} value={`${n+18}`}>{n+18}</option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="block"><span className="text-sm">&nbsp;</span></label>
                <select
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  value={ageMax}
                  onChange={e=>setAgeMax(e.target.value)}
                >
                  <option value="">Max</option>
                  {[...Array(47).keys()].map(n=>(
                    <option key={n} value={`${n+18}`}>{n+18}</option>
                  ))}
                  <option value="65+">65+</option>
                </select>
              </div>
            </div>

            {/* Gender + Language */}
            <div className="flex space-x-4 mt-4">
              <div className="w-1/2">
                <label className="block"><span className="text-sm">Gender ⓘ</span></label>
                <select
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  value={gender}
                  onChange={e=>setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  {genders.map(g=>(
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="block"><span className="text-sm">Language ⓘ</span></label>
                <select
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  value={language}
                  onChange={e=>setLanguage(e.target.value)}
                >
                  <option value="">Select language</option>
                  {languages.map(l=>(
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="block mt-4">
              <span className="text-sm">Match Type (optional) ⓘ</span>
              <select
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                value={matchType}
                onChange={e=>setMatchType(e.target.value)}
              >
                <option value="">Select match type</option>
                <option value="na">na</option>
                <option value="exact">exact</option>
                <option value="phrase">phrase</option>
                <option value="broad">broad</option>
              </select>
            </label>

            <label className="block relative mt-4">
              <span className="text-sm">Ad Set Date (optional) ⓘ</span>
              <input
                type="date"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 pr-10"
                value={adsetDate}
                onChange={e=>setAdsetDate(e.target.value)}
              />
              <svg className="w-5 h-5 absolute right-3 bottom-3 text-white"><path d="M..."/></svg>
            </label>
          </div>

          {/* Ad Name */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-green-500 text-xl font-semibold">Ad Name</h2>
            <label className="block">
              <span className="text-sm">Ad Type ⓘ</span>
              <select
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                value={adType}
                onChange={e=>setAdType(e.target.value)}
              >
                <option value="">Select ad type</option>
                {platform && adTypesByPlatform[platform]?.map(a=>(
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm">Ad Date (optional) ⓘ</span>
              <input
                type="date"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 pr-10"
                value={adDate}
                onChange={e=>setAdDate(e.target.value)}
              />
              <svg className="w-5 h-5 absolute right-3 bottom-3 text-white"><path d="M..."/></svg>
            </label>
            <label className="block">
              <span className="text-sm">Ad Theme (optional) ⓘ</span>
              <input
                type="text"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                placeholder="Enter ad theme"
                value={adTheme}
                onChange={e=>setAdTheme(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* RIGHT: OUTPUT CARDS */}
        <div className="space-y-8">
          {/* Final Result */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-green-500 text-xl font-semibold">Final Result</h2>
            <div className="flex justify-between items-center">
              <span>Campaign Name</span>
              <button
                className="text-sm text-green-400 hover:text-green-200"
                onClick={()=>{ copy(campaignName) }}
              >Copy</button>
            </div>
            <div className="break-all">{campaignName}</div>

            <div className="flex justify-between items-center mt-2">
              <span>Ad Set Name</span>
              <button
                className="text-sm text-green-400 hover:text-green-200"
                onClick={()=>{ copy(adSetName) }}
              >Copy</button>
            </div>
            <div className="break-all">{adSetName}</div>

            <div className="flex justify-between items-center mt-2">
              <span>Ad Name</span>
              <button
                className="text-sm text-green-400 hover:text-green-200"
                onClick={()=>{ copy(adName) }}
              >Copy</button>
            </div>
            <div className="break-all">{adName}</div>
          </div>

          {/* UTM Generator */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-green-500 text-xl font-semibold">UTM Generator</h2>
            <textarea
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 h-24"
              readOnly
              value={utmString}
            />
            <div className="flex space-x-4">
              <button
                className="bg-green-500 px-4 py-2 rounded-md text-sm"
                onClick={generateUTM}
              >Generate</button>
              <button
                className="bg-gray-600 px-4 py-2 rounded-md text-sm"
                onClick={()=>{ copy(utmString) }}
              >Copy</button>
            </div>
          </div>

          {/* Landing Page URL */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-green-500 text-xl font-semibold">Landing Page URL</h2>
            <input
              id="landing-page"
              type="url"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              placeholder="https://www.cnn.com/"
            />
            <textarea
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 h-24"
              readOnly
              placeholder="URL + UTM"
              value={finalUrl}
            />
            <div className="flex space-x-4">
              <button
                className="bg-green-500 px-4 py-2 rounded-md text-sm"
                onClick={generateURL}
              >Generate</button>
              <button
                className="bg-gray-600 px-4 py-2 rounded-md text-sm"
                onClick={()=>{ copy(finalUrl) }}
              >Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
