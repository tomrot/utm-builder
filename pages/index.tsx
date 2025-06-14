import { useState, useEffect } from 'react'
import sanitizeText from '../utils/sanitizeText'
import formatToDDMMYY from '../utils/formatToDDMMYY'

export default function Home() {
  // Inputs
  const [platform, setPlatform] = useState('')
  const [product, setProduct] = useState('')
  const [campType, setCampType] = useState('')
  const [campTheme, setCampTheme] = useState('')
  const [campDate, setCampDate] = useState('')

  const [adSetTheme, setAdSetTheme] = useState('')
  const [targeting, setTargeting] = useState('')
  const [countries, setCountries] = useState('')
  const [stateZip, setStateZip] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [gender, setGender] = useState('')
  const [language, setLanguage] = useState('')
  const [matchType, setMatchType] = useState('')
  const [adSetDate, setAdSetDate] = useState('')

  const [adType, setAdType] = useState('')
  const [adDate, setAdDate] = useState('')
  const [adTheme, setAdTheme] = useState('')

  // Outputs
  const [campaignName, setCampaignName] = useState('na_na_na')
  const [adSetName, setAdSetName] = useState('na_na_na_na-na_na_na_na_na_na')
  const [adName, setAdName] = useState('na_na_na_na_na')
  const [utmString, setUtmString] = useState('')
  const [finalUrl, setFinalUrl] = useState('')

  // helper: sanitize + replace spaces with +
  const seg = (val: string, def = 'na') =>
    (sanitizeText(val) || def).replace(/\s+/g, '+')

  // dynamic Campaign Type options per platform
  const campaignTypeOptions: Record<string, Array<{label:string;value:string}>> = {
    Facebook: [
      {label:'Conversions',value:'conv'},
      {label:'Lead Generation',value:'lg'},
      {label:'Brand Awareness',value:'awr'},
      {label:'Reach',value:'reach'},
      {label:'Traffic',value:'trfc'},
      {label:'Engagement',value:'eng'},
      {label:'Video Views',value:'vv'},
      {label:'Messages',value:'msg'},
      {label:'Boost',value:'bst'},
    ],
    'Google Ads': [
      {label:'Search',value:'srch'},
      {label:'Display / GDN',value:'gdn'},
      {label:'Discovery',value:'disc'},
      {label:'Performance Max',value:'pmax'},
      {label:'YouTube (video)',value:'yt'},
    ],
    'Microsoft Ads': [
      {label:'Search',value:'srch'},
      {label:'Audience Ads / MAN',value:'man'},
      {label:'Smart Search Campaign',value:'smrt'},
    ],
    TikTok: [
      {label:'Conversions',value:'conv'},
      {label:'Lead Generation',value:'lg'},
      {label:'Reach',value:'reach'},
      {label:'Traffic',value:'trfc'},
      {label:'Video Views',value:'vv'},
    ],
    LinkedIn: [
      {label:'Conversions',value:'conv'},
      {label:'Lead Generation',value:'lg'},
      {label:'Brand Awareness',value:'awr'},
      {label:'Website Visits (Traffic)',value:'trfc'},
      {label:'Engagement',value:'eng'},
      {label:'Video Views',value:'vv'},
    ],
  }

  // Ad Type options per platform
  const adTypeOptions: Record<string, Array<{label:string;value:string}>> = {
    Facebook: [
      {label:'Image',value:'img'},
      {label:'Video',value:'vid'},
      {label:'Carousel',value:'crsel'},
      {label:'Dynamic Creative Ad (DCO)',value:'dyn'},
      {label:'GIF',value:'gif'},
    ],
    'Google Ads': [
      {label:'Responsive Search Ad',value:'rsa'},
      {label:'Call Ad',value:'call'},
      {label:'Dynamic Search Ad',value:'dsa'},
      {label:'Video Ad',value:'vid'},
      {label:'Responsive Display Ad',value:'rda'},
      {label:'Discovery Carousel Ad',value:'dca'},
      {label:'Discovery Ad',value:'disco'},
      {label:'Masthead Ads',value:'mast'},
      {label:'In-feed Ads',value:'infd'},
      {label:'Bumper Ads (6s)',value:'bmp'},
      {label:'Skippable In-Stream Ads',value:'skr'},
      {label:'Non-skippable In-Stream Ads',value:'nsk'},
      {label:'TrueView Ads',value:'tvw'},
      {label:'Shorts Ads',value:'shr'},
    ],
    'Microsoft Ads': [
      {label:'Expanded Text Ad',value:'xta'},
      {label:'Responsive Search Ads',value:'rsa'},
      {label:'Dynamic Search Ads',value:'dsa'},
      {label:'Bing Smart Search Ads',value:'bss'},
      {label:'Audience Ads',value:'aud'},
      {label:'Multimedia Ads',value:'mmd'},
    ],
    TikTok: [
      {label:'Image',value:'img'},
      {label:'Video',value:'vid'},
      {label:'Spark Ads',value:'spk'},
      {label:'Carousel Ads',value:'crsel'},
    ],
    LinkedIn: [
      {label:'Image',value:'img'},
      {label:'Video',value:'vid'},
      {label:'Carousel',value:'crsel'},
      {label:'Text',value:'txt'},
      {label:'Conversation',value:'con'},
      {label:'Spotlight',value:'spt'},
      {label:'Message',value:'msg'},
    ],
  }

  // Countries dropdown list with labels and values
  const countryList = [
    {label:'All',value:'all'},
    {label:'United States',value:'us'},
    {label:'Israel',value:'il'},
    {label:'Austria',value:'at'},
    {label:'Belgium',value:'be'},
    {label:'Bulgaria',value:'bg'},
    {label:'Croatia',value:'hr'},
    {label:'Cyprus',value:'cy'},
    {label:'Czechia',value:'cz'},
    {label:'Denmark',value:'dk'},
    {label:'Estonia',value:'ee'},
    {label:'Finland',value:'fi'},
    {label:'France',value:'fr'},
    {label:'Germany',value:'de'},
    {label:'Greece',value:'gr'},
    {label:'Hungary',value:'hu'},
    {label:'Ireland',value:'ie'},
    {label:'Italy',value:'it'},
    {label:'Latvia',value:'lv'},
    {label:'Lithuania',value:'lt'},
    {label:'Luxembourg',value:'lu'},
    {label:'Malta',value:'mt'},
    {label:'Netherlands',value:'nl'},
    {label:'Poland',value:'pl'},
    {label:'Portugal',value:'pt'},
    {label:'Romania',value:'ro'},
    {label:'Slovakia',value:'sk'},
    {label:'Slovenia',value:'si'},
    {label:'Spain',value:'es'},
    {label:'Sweden',value:'se'},
  ]

  // Languages
  const languageList = [
    {label:'All',value:'all'},
    {label:'English',value:'en'},
    {label:'Spanish',value:'es'},
    {label:'Hebrew',value:'he'},
    {label:'Romanian',value:'ro'},
    {label:'Arabic',value:'ar'},
    {label:'Russian',value:'ru'},
    {label:'German',value:'de'},
    {label:'Portuguese',value:'pt'},
  ]

  // Generate names whenever inputs change
  useEffect(() => {
    // Campaign Name: product_type_date_theme
    const p = seg(product)
    const t = campType || 'na'
    const d = campDate ? formatToDDMMYY(campDate) : 'na'
    const th = campTheme ? seg(campTheme,'na') : 'na'
    setCampaignName(`${p}_${t}_${d}_${th}`)

    // Ad Set Name:
    // product_type_targeting_countries_stateZip_ageMin-ageMax_gender_language_match_date_theme
    const tar = targeting || 'na'
    const cs = countries || 'na'  // countries already contains the short code
    const sz = stateZip ? seg(stateZip,'na') : 'na'
    const ag = `${ageMin||'na'}-${ageMax||'na'}`
    const gd = gender||'na'
    const lg = language||'na'
    const mt = matchType||'na'
    const ad = adSetDate ? formatToDDMMYY(adSetDate) : 'na'
    const ast = adSetTheme?seg(adSetTheme,'na'):'na'
    setAdSetName(
      `${p}_${t}_${tar}_${cs}_${sz}_${ag}_${gd}_${lg}_${mt}_${ad}_${ast}`
    )

    // Ad Name: product_type_adType_date_theme
    const at = adType||'na'
    const adt = adDate ? formatToDDMMYY(adDate) : 'na'
    const ath = adTheme?seg(adTheme,'na'):'na'
    setAdName(`${p}_${t}_${at}_${adt}_${ath}`)
  }, [
    product, campType, campDate, campTheme,
    targeting, countries, stateZip, ageMin, ageMax,
    gender, language, matchType, adSetDate, adSetTheme,
    adType, adDate, adTheme,
  ])

  // UTM Generation (exact templates)
  function generateUTM() {
    if (!platform) {
      alert('Please Choose Platform')
      return
    }
    let utm = ''
    switch(platform) {
      case 'Facebook':
        utm = `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_ad={{ad.name}}&cid={{campaign.id}}&asid={{adset.id}}&aid={{ad.id}}&fsource={{site_source_name}}&placement={{placement}}`
        break
      case 'Google Ads':
        utm = `{lpurl}?{ignore}&utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_adset={_adset}&utm_ad={_ad}&utm_term={keyword}&adpos={adposition}&device={device}&creative={creative}&placement={placement}&cid={campaignid}&asid={adgroupid}&kmt={matchtype}&net={network}&device_model={devicemodel}&target={targetid}`
        break
      case 'Microsoft Ads':
        utm = `{lpurl}?utm_source=bing&utm_medium=cpc&cid={CampaignId}&utm_campaign={Campaign}&asid={AdGroupId}&utm_adset={AdGroup}&aid={AdId}&kmt={MatchType}&utm_term={keyword:default}-{QueryString}&target={TargetId}&net={Network}&device={Device}`
        break
      case 'TikTok':
        utm = `utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_NAME__&utm_adset=__AID_NAME__&utm_ad=__CID_NAME__&cid=__CAMPAIGN_ID__&asid=__AID__&aid=__CID__&placement=__PLACEMENT__&ttclid=__CLICKID__`
        break
      case 'LinkedIn':
        utm = `utm_source=linkedin&utm_medium=paid_social&utm_campaign={campaign.name}&utm_content={ad.name}`
        break
    }
    setUtmString(utm)
  }

  // Final URL
  function generateURL() {
    const base = (document.getElementById('landing-page') as HTMLInputElement).value.trim()
    if (!base) {
      alert('Please enter Landing Page URL')
      return
    }
    let sep = base.includes('?')?'&':'?'
    setFinalUrl(`${base}${sep}${utmString}`)
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'rgb(55, 65, 81)'}}>
      <div className="container mx-auto p-6 grid grid-cols-2 gap-8">
        {/* Left */}
        <div>
          {/* Campaign Name */}
          <div className="mb-8 p-6 bg-gray-800 rounded-lg text-white">
            <h2 className="text-lg font-semibold mb-4">Campaign Name</h2>
            <div className="mb-4">
              <label className="block mb-1">Platform ⓘ</label>
              <select
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                value={platform}
                onChange={e => setPlatform(e.target.value)}
              >
                <option value="">Select platform</option>
                {Object.keys(campaignTypeOptions).map(pl => (
                  <option key={pl} value={pl}>{pl}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Product ⓘ</label>
              <input
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="Enter product"
                value={product}
                onChange={e=>setProduct(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Campaign Type ⓘ</label>
              <select
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                value={campType}
                onChange={e=>setCampType(e.target.value)}
                disabled={!platform}
              >
                <option value="">{platform?'Select type':'Select platform first'}</option>
                {platform && campaignTypeOptions[platform].map(o=>(
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Campaign Theme (optional) ⓘ</label>
              <input
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="Enter theme"
                value={campTheme}
                onChange={e=>setCampTheme(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Campaign Date (optional) ⓘ</label>
              <input
                type="date"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                style={{
                  colorScheme: 'dark',
                  color: '#fff'
                }}
                value={campDate}
                onChange={e=>setCampDate(e.target.value)}
              />
            </div>
          </div>

          {/* Ad Set Name */}
          <div className="mb-8 p-6 bg-gray-800 rounded-lg text-white">
            <h2 className="text-lg font-semibold mb-4">Ad Set Name</h2>
            <div className="mb-4">
              <label className="block mb-1">Ad Set Theme (optional) ⓘ</label>
              <input
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="Enter ad set theme"
                value={adSetTheme}
                onChange={e=>setAdSetTheme(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Targeting Type ⓘ</label>
              <select
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                value={targeting}
                onChange={e=>setTargeting(e.target.value)}
              >
                <option value="">Select type</option>
                <option value="lal">Lookalike</option>
                <option value="rem">Remarketing</option>
                <option value="wide">Wide (prospecting)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Countries ⓘ</label>
              <select
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                value={countries}
                onChange={e=>setCountries(e.target.value)}
                size={1}
              >
                <option value="">Select country</option>
                {countryList.map(c=>(
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">State/City/Zip(s) (optional) ⓘ</label>
              <input
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="e.g. CA-LosAngeles-90001"
                value={stateZip}
                onChange={e=>setStateZip(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Age ⓘ</label>
              <div className="flex space-x-2">
                <select
                  className="w-1/2 p-2 bg-gray-700 text-white rounded border border-gray-600"
                  value={ageMin}
                  onChange={e=>setAgeMin(e.target.value)}
                >
                  <option value="">Min</option>
                  {Array.from({length:48},(_,i)=>i+18).concat(65).map(n=>(
                    <option key={n} value={n===65?'65+':n}>{n===65?'65+':n}</option>
                  ))}
                </select>
                <select
                  className="w-1/2 p-2 bg-gray-700 text-white rounded border border-gray-600"
                  value={ageMax}
                  onChange={e=>setAgeMax(e.target.value)}
                >
                  <option value="">Max</option>
                  {Array.from({length:48},(_,i)=>i+18).concat(65).map(n=>(
                    <option key={n} value={n===65?'65+':n}>{n===65?'65+':n}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label className="block mb-1">Gender ⓘ</label>
                <select
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                  value={gender}
                  onChange={e=>setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="all">All</option>
                  <option value="f">Female/Woman</option>
                  <option value="m">Male/Man</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1">Language ⓘ</label>
                <select
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                  value={language}
                  onChange={e=>setLanguage(e.target.value)}
                >
                  <option value="">Select language</option>
                  {languageList.map(l=>(
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Match Type (optional) ⓘ</label>
              <select
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                value={matchType}
                onChange={e=>setMatchType(e.target.value)}
              >
                <option value="">Select match type</option>
                <option value="na">na</option>
                <option value="exact">exact</option>
                <option value="phrase">phrase</option>
                <option value="broad">broad</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Ad Set Date (optional) ⓘ</label>
              <input
                type="date"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                style={{
                  colorScheme: 'dark',
                  color: '#fff'
                }}
                value={adSetDate}
                onChange={e=>setAdSetDate(e.target.value)}
              />
            </div>
          </div>

          {/* Ad Name */}
          <div className="p-6 bg-gray-800 rounded-lg text-white">
            <h2 className="text-lg font-semibold mb-4">Ad Name</h2>
            <div className="mb-4">
              <label className="block mb-1">Ad Type ⓘ</label>
              <select
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                value={adType}
                onChange={e=>setAdType(e.target.value)}
                disabled={!platform}
              >
                <option value="">{platform?'Select ad type':'Select platform first'}</option>
                {platform && adTypeOptions[platform]?.map(o=>(
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Ad Date ⓘ</label>
              <input
                type="date"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                style={{
                  colorScheme: 'dark',
                  color: '#fff'
                }}
                value={adDate}
                onChange={e=>setAdDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Ad Theme ⓘ</label>
              <input
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="Enter ad theme"
                value={adTheme}
                onChange={e=>setAdTheme(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-8">
          <div className="p-6 bg-gray-800 rounded-lg text-white">
            <h2 className="text-lg font-semibold mb-4">Final Result</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Campaign Name</span>
              <button className="text-green-400 text-sm">Copy</button>
            </div>
            <div className="mb-4">{campaignName}</div>

            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Ad Set Name</span>
              <button className="text-green-400 text-sm">Copy</button>
            </div>
            <div className="mb-4">{adSetName}</div>

            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Ad Name</span>
              <button className="text-green-400 text-sm">Copy</button>
            </div>
            <div>{adName}</div>
          </div>

          <div className="p-6 bg-gray-800 rounded-lg text-white">
            <h2 className="text-lg font-semibold mb-4">UTM Generator</h2>
            <textarea
              readOnly
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 mb-2 resize-none"
              style={{
                minHeight: '80px',
                height: utmString ? 'auto' : '80px'
              }}
              rows={utmString ? Math.ceil(utmString.length / 80) + 1 : 4}
              value={utmString || 'No UTM generated yet.'}
            />
            <div className="flex space-x-4">
              <button
                onClick={generateUTM}
                className="px-4 py-2 bg-green-500 rounded text-white"
              >
                Generate
              </button>
              <button
                onClick={()=>navigator.clipboard.writeText(utmString)}
                className="px-4 py-2 bg-gray-600 rounded text-white"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-800 rounded-lg text-white">
            <h2 className="text-lg font-semibold mb-4">Landing Page URL</h2>
            <input
              id="landing-page"
              type="url"
              className="w-full p-2 mb-2 bg-gray-700 text-white rounded border border-gray-600"
              placeholder="https://www.cnn.com/"
            />
            <textarea
              readOnly
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 resize-none mb-2"
              style={{
                minHeight: '80px',
                height: finalUrl ? 'auto' : '80px'
              }}
              rows={finalUrl ? Math.ceil(finalUrl.length / 80) + 1 : 4}
              placeholder="URL + UTM"
              value={finalUrl || ''}
            />
            <div className="flex space-x-4">
              <button
                onClick={generateURL}
                className="px-4 py-2 bg-green-500 rounded text-white"
              >
                Generate
              </button>
              <button
                onClick={()=>navigator.clipboard.writeText(finalUrl)}
                className="px-4 py-2 bg-gray-600 rounded text-white"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
