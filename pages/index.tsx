import { useState, useEffect } from 'react';
import sanitizeText from '../utils/sanitizeText';
import formatToDDMMYY from '../utils/formatToDDMMYY';

export default function Home() {
  // --- State Inputs ---
  const [platform, setPlatform] = useState('');
  const [product, setProduct] = useState('');
  const [campType, setCampType] = useState('');
  const [campTheme, setCampTheme] = useState('');
  const [campDate, setCampDate] = useState('');
  const [adsetTheme, setAdsetTheme] = useState('');
  const [targetType, setTargetType] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [scz, setScz] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');
  const [matchType, setMatchType] = useState('');
  const [adsetDate, setAdsetDate] = useState('');
  const [adType, setAdType] = useState('');
  const [adTheme, setAdTheme] = useState('');
  const [adDate, setAdDate] = useState('');

  // --- State Outputs ---
  const [campaignName, setCampaignName] = useState('na_na_na');
  const [adsetName, setAdsetName]       = useState('na_na_na_na_na_na_na_na_na_na');
  const [adName, setAdName]             = useState('na_na_na_na_na');
  const [utm, setUtm]                   = useState('');
  const [fullUrl, setFullUrl]           = useState('');

  // --- Option Lists ---
  const platformOptions = [
    { label: 'Facebook', value: 'facebook' },
    { label: 'Google Ads', value: 'google_ads' },
    { label: 'Microsoft Ads', value: 'microsoft_ads' },
    { label: 'TikTok', value: 'tiktok' },
    { label: 'LinkedIn', value: 'linkedin' },
  ];

  const campaignTypesByPlatform: Record<string, {label:string;value:string}[]> = {
    facebook: [
      { label:'Conversions', value:'conv' },
      { label:'Lead Generation', value:'lg' },
      { label:'Brand Awareness', value:'awr' },
      { label:'Reach', value:'reach' },
      { label:'Traffic', value:'trfc' },
      { label:'Engagement', value:'eng' },
      { label:'Video Views', value:'vv' },
      { label:'Messages', value:'msg' },
      { label:'Boost', value:'bst' },
    ],
    google_ads: [
      { label:'Search', value:'srch' },
      { label:'Display / GDN', value:'gdn' },
      { label:'Discovery', value:'disc' },
      { label:'Performance Max', value:'pmax' },
      { label:'YouTube (video)', value:'yt' },
    ],
    microsoft_ads: [
      { label:'Search', value:'srch' },
      { label:'Audience Ads / MAN', value:'man' },
      { label:'Smart Search Campaign', value:'smrt' },
    ],
    tiktok: [
      { label:'Conversions', value:'conv' },
      { label:'Lead Generation', value:'lg' },
      { label:'Reach', value:'reach' },
      { label:'Traffic', value:'trfc' },
      { label:'Video Views', value:'vv' },
    ],
    linkedin: [
      { label:'Conversions', value:'conv' },
      { label:'Lead Generation', value:'lg' },
      { label:'Brand Awareness', value:'awr' },
      { label:'Website Visits (Traffic)', value:'trfc' },
      { label:'Engagement', value:'eng' },
      { label:'Video Views', value:'vv' },
    ],
  };

  const adTypesByPlatform: Record<string, {label:string;value:string}[]> = {
    facebook: [
      { label:'Image', value:'img' },
      { label:'Video', value:'vid' },
      { label:'Carousel', value:'crsel' },
      { label:'Dynamic Creative Ad (DCO)', value:'dyn' },
      { label:'GIF', value:'gif' },
    ],
    google_ads: [
      { label:'Responsive Search Ad', value:'rsa' },
      { label:'Call Ad', value:'call' },
      { label:'Dynamic Search Ad', value:'dsa' },
      { label:'Video Ad', value:'vid' },
      { label:'Responsive Display Ad', value:'rda' },
      { label:'Discovery Carousel Ad', value:'dca' },
      { label:'Discovery Ad', value:'disco' },
      { label:'Bumper Ads', value:'bmp' },
      { label:'Skippable In-Stream Ads', value:'skr' },
    ],
    microsoft_ads: [
      { label:'Expanded Text Ad', value:'xta' },
      { label:'Responsive Search Ads', value:'rsa' },
      { label:'Dynamic Search Ads', value:'dsa' },
      { label:'Bing Smart Search Ads', value:'bss' },
    ],
    tiktok: [
      { label:'Image', value:'img' },
      { label:'Video', value:'vid' },
      { label:'Spark Ads', value:'spk' },
      { label:'Carousel Ads', value:'car' },
    ],
    linkedin: [
      { label:'Image', value:'img' },
      { label:'Video', value:'vid' },
      { label:'Carousel', value:'crsel' },
      { label:'Text', value:'txt' },
      { label:'Conversation', value:'con' },
      { label:'Spotlight', value:'spt' },
      { label:'Message', value:'msg' },
    ],
  };

  const countryList = [
    { label:'All', value:'all' },
    { label:'United States', value:'us' },
    { label:'Israel', value:'il' },
    { label:'Austria', value:'at' },
    { label:'Belgium', value:'be' },
    { label:'Bulgaria', value:'bg' },
    { label:'Croatia', value:'hr' },
    { label:'Cyprus', value:'cy' },
    { label:'Czechia', value:'cz' },
    { label:'Denmark', value:'dk' },
    { label:'Estonia', value:'ee' },
    { label:'Finland', value:'fi' },
    { label:'France', value:'fr' },
    { label:'Germany', value:'de' },
    { label:'Greece', value:'gr' },
    { label:'Hungary', value:'hu' },
    { label:'Ireland', value:'ie' },
    { label:'Italy', value:'it' },
    { label:'Latvia', value:'lv' },
    { label:'Lithuania', value:'lt' },
    { label:'Luxembourg', value:'lu' },
    { label:'Malta', value:'mt' },
    { label:'Netherlands', value:'nl' },
    { label:'Poland', value:'pl' },
    { label:'Portugal', value:'pt' },
    { label:'Romania', value:'ro' },
    { label:'Slovakia', value:'sk' },
    { label:'Slovenia', value:'si' },
    { label:'Spain', value:'es' },
    { label:'Sweden', value:'se' },
  ];

  const genderOptions = [
    { label:'All', value:'all' },
    { label:'Female/Woman', value:'f' },
    { label:'Male/Man', value:'m' },
  ];

  const languageOptions = [
    { label:'All', value:'all' },
    { label:'English', value:'en' },
    { label:'Spanish', value:'es' },
    { label:'Hebrew', value:'he' },
    { label:'Romanian', value:'ro' },
    { label:'Arabic', value:'ar' },
    { label:'Russian', value:'ru' },
    { label:'German', value:'de' },
    { label:'Portuguese', value:'pt' },
  ];

  const matchOptions = [
    { label:'na', value:'na' },
    { label:'Exact', value:'exact' },
    { label:'Phrase', value:'phrase' },
    { label:'Broad', value:'broad' },
  ];

  // --- Name generation logic ---
  useEffect(() => {
    const seg = (v?:string) =>
      (sanitizeText(v||'')||'na').replace(/\s+/g,'+');

    // Campaign Name: product_type_date_theme
    const p = seg(product);
    const t = campType||'na';
    const d = campDate?formatToDDMMYY(campDate):'na';
    const th= campTheme?seg(campTheme):'na';
    setCampaignName(`${p}_${t}_${d}_${th}`);

    // Ad Set Name:
    // product_type_target_countries_scz_age_gender_language_match_date_theme
    const tg = targetType||'na';
    const ct = countries.length?countries.join('-'):'na';
    const sc= scz?seg(scz):'na';
    const ag= `${ageMin||'na'}-${ageMax||'na'}`;
    const gd= gender||'na';
    const lg= language||'na';
    const mt= matchType||'na';
    const ad= adsetDate?formatToDDMMYY(adsetDate):'na';
    const ath= adsetTheme?seg(adsetTheme):'na';
    setAdsetName(
      `${p}_${t}_${tg}_${ct}_${sc}_${ag}_${gd}_${lg}_${mt}_${ad}_${ath}`
    );

    // Ad Name:
    // product_type_adtype_date_theme
    const at = adType||'na';
    const adt= adDate?formatToDDMMYY(adDate):'na';
    const athm= adTheme?seg(adTheme):'na';
    setAdName(`${p}_${t}_${at}_${adt}_${athm}`);
  }, [
    product, campType, campDate, campTheme,
    targetType, countries, scz, ageMin, ageMax, gender, language, matchType,
    adsetDate, adsetTheme,
    adType, adDate, adTheme
  ]);

  // --- UTM & URL ---
  function onGenerateUtm() {
    if (!platform) {
      const n = document.createElement('div');
      n.innerText = 'Please choose Platform';
      n.className = 'fixed bottom-5 right-5 bg-black/70 text-white p-2 rounded';
      document.body.appendChild(n);
      setTimeout(()=>n.remove(),2000);
      return;
    }
    let s = '';
    switch(platform) {
      case 'facebook':
        s = `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_ad={{ad.name}}&cid={{campaign.id}}&asid={{adset.id}}&aid={{ad.id}}&fsource={{site_source_name}}&placement={{placement}}`;
        break;
      case 'google_ads':
        s = `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaign}&utm_adset={adset}&utm_ad={ad}&utm_term={keyword}&adpos={adposition}&device={device}&creative={creative}&placement={placement}&cid={campaignid}&asid={adgroupid}&kmt={matchtype}&net={network}&device_model={devicemodel}&target={targetid}`;
        break;
      case 'microsoft_ads':
        s = `{lpurl}?utm_source=bing&utm_medium=cpc&cid={CampaignId}&utm_campaign={Campaign}&asid={AdGroupId}&utm_adset={AdGroup}&aid={AdId}&kmt={MatchType}&utm_term={keyword:default}-{QueryString}&target={TargetId}&net={Network}&device={Device}`;
        break;
      case 'tiktok':
        s = `utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_NAME__&utm_adset=__AID_NAME__&utm_ad=__CID_NAME__&cid=__CAMPAIGN_ID__&asid=__AID__&aid=__CID__&placement=__PLACEMENT__&ttclid=__CLICKID__`;
        break;
      case 'linkedin':
        s = `utm_source=linkedin&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`;
        break;
    }
    setUtm(s);
  }

  function onGenerateUrl() {
    const inp = document.getElementById('landing-page') as HTMLInputElement;
    if (!inp?.value) return alert('Please enter Landing Page URL');
    const sep = inp.value.includes('?')?'&':'?';
    setFullUrl(`${inp.value}${sep}${utm}`);
  }

  // --- Clipboard ---
  const copy = (t:string)=>navigator.clipboard.writeText(t);

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-gray-200">
      {/* make date pickers white */}
      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-8">
          {/* Campaign */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-green-500 text-xl font-semibold">Campaign Name</h3>
            {/* Platform */}
            <label className="block text-sm">Platform ⓘ</label>
            <select
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600"
              value={platform}
              onChange={e=>{ setPlatform(e.target.value); setCampType(''); }}
            >
              <option value="">Select platform</option>
              {platformOptions.map(o=>(
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* Product */}
            <label className="block text-sm">Product ⓘ</label>
            <input
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              placeholder="Enter product"
              value={product}
              onChange={e=>setProduct(e.target.value)}
            />
            {/* Camp Type */}
            <label className="block text-sm">Campaign Type ⓘ</label>
            <select
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600"
              disabled={!platform}
              value={campType}
              onChange={e=>setCampType(e.target.value)}
            >
              <option value="">
                {platform?'Select type':'Select platform first'}
              </option>
              {platform && campaignTypesByPlatform[platform].map(o=>(
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* Theme */}
            <label className="block text-sm">Campaign Theme (optional) ⓘ</label>
            <input
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              placeholder="Enter theme"
              value={campTheme}
              onChange={e=>setCampTheme(e.target.value)}
            />
            {/* Date */}
            <label className="block text-sm">Campaign Date (optional) ⓘ</label>
            <input
              type="date"
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              value={campDate}
              onChange={e=>setCampDate(e.target.value)}
            />
          </div>

          {/* Ad Set */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-green-500 text-xl font-semibold">Ad Set Name</h3>
            {/* Theme */}
            <label className="block text-sm">Ad Set Theme (optional) ⓘ</label>
            <input
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              placeholder="Enter ad set theme"
              value={adsetTheme}
              onChange={e=>setAdsetTheme(e.target.value)}
            />
            {/* Target */}
            <label className="block text-sm">Targeting type ⓘ</label>
            <select
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600"
              value={targetType}
              onChange={e=>setTargetType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="lal">Lookalike</option>
              <option value="rem">Remarketing</option>
              <option value="wide">Wide</option>
            </select>
            {/* Countries */}
            <label className="block text-sm">Countries ⓘ</label>
            <select
              multiple
              size={1}
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 cursor-pointer"
              value={countries}
              onChange={e=>{
                const vals = Array.from(e.target.selectedOptions).map(o=>o.value);
                setCountries(vals);
              }}
            >
              <option value="" disabled>Select countries</option>
              {countryList.map(o=>(
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* SCZ */}
            <label className="block text-sm">State/City/Zip(s) (optional) ⓘ</label>
            <input
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              placeholder="e.g. CA-LosAngeles-90001"
              value={scz}
              onChange={e=>setScz(e.target.value)}
            />
            {/* Age row */}
            <div>
              <label className="block text-sm">Age ⓘ</label>
              <div className="flex space-x-2">
                <select
                  className="w-1/2 bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
                  value={ageMin}
                  onChange={e=>setAgeMin(e.target.value)}
                >
                  <option value="">Min</option>
                  {Array.from({length:48},(_,i)=>i+18).concat(65).map(n=>(
                    <option key={n} value={n===65?'65+':n}>{n===65?'65+':n}</option>
                  ))}
                </select>
                <select
                  className="w-1/2 bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
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
            {/* Gender + Language row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm">Gender ⓘ</label>
                <select
                  className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
                  value={gender}
                  onChange={e=>setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map(o=>(
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm">Language ⓘ</label>
                <select
                  className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
                  value={language}
                  onChange={e=>setLanguage(e.target.value)}
                >
                  <option value="">Select language</option>
                  {languageOptions.map(o=>(
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Match */}
            <label className="block text-sm">Match Type (optional) ⓘ</label>
            <select
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              value={matchType}
              onChange={e=>setMatchType(e.target.value)}
            >
              <option value="">Select match type</option>
              {matchOptions.map(o=>(
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* Ad Set Date */}
            <label className="block text-sm">Ad Set Date (optional) ⓘ</label>
            <input
              type="date"
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              value={adsetDate}
              onChange={e=>setAdsetDate(e.target.value)}
            />
          </div>

          {/* Ad Name */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-green-500 text-xl font-semibold">Ad Name</h3>
            {/* Ad Type */}
            <label className="block text-sm">Ad Type ⓘ</label>
            <select
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              disabled={!platform}
              value={adType}
              onChange={e=>setAdType(e.target.value)}
            >
              <option value="">Select ad type</option>
              {platform && adTypesByPlatform[platform].map(o=>(
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* Theme */}
            <label className="block text-sm">Ad Theme ⓘ</label>
            <input
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              placeholder="Enter ad theme"
              value={adTheme}
              onChange={e=>setAdTheme(e.target.value)}
            />
            {/* Date */}
            <label className="block text-sm">Ad Date ⓘ</label>
            <input
              type="date"
              className="mt-1 block w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              value={adDate}
              onChange={e=>setAdDate(e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          {/* Final Result */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-green-500 text-xl font-semibold">Final Result</h3>
            <div className="space-y-3">
              {/* Campaign Name */}
              <div>
                <span className="font-medium">Campaign Name</span>
                <button
                  className="text-green-400 text-sm float-right"
                  onClick={()=>copy(campaignName)}
                >Copy</button>
                <p className="mt-1">{campaignName}</p>
              </div>
              {/* Ad Set Name */}
              <div>
                <span className="font-medium">Ad Set Name</span>
                <button
                  className="text-green-400 text-sm float-right"
                  onClick={()=>copy(adsetName)}
                >Copy</button>
                <p className="mt-1">{adsetName}</p>
              </div>
              {/* Ad Name */}
              <div>
                <span className="font-medium">Ad Name</span>
                <button
                  className="text-green-400 text-sm float-right"
                  onClick={()=>copy(adName)}
                >Copy</button>
                <p className="mt-1">{adName}</p>
              </div>
            </div>
          </div>

          {/* UTM Generator */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-green-500 text-xl font-semibold">UTM Generator</h3>
            <textarea
              className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2 h-24 resize-none"
              readOnly
              placeholder="No UTM generated yet."
              value={utm}
            />
            <div className="flex space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={onGenerateUtm}
              >Generate</button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={()=>copy(utm)}
              >Copy</button>
            </div>
          </div>

          {/* Final URL */}
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-green-500 text-xl font-semibold">Landing Page URL</h3>
            <input
              id="landing-page"
              type="url"
              className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
              placeholder="https://www.cnn.com/"
            />
            <textarea
              className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2 h-24 resize-none"
              readOnly
              placeholder="URL + UTM"
              value={fullUrl}
            />
            <div className="flex space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={onGenerateUrl}
              >Generate</button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={()=>copy(fullUrl)}
              >Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
