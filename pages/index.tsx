// pages/index.tsx

import { useState, useEffect } from 'react';
import sanitizeText from '../utils/sanitizeText';
import formatToDDMMYY from '../utils/formatToDDMMYY';

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
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Awareness', value: 'awr' },
    { label: 'Traffic', value: 'trfc' },
    { label: 'Video Views', value: 'vv' },
  ],
  'Microsoft Ads': [
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Traffic', value: 'trfc' },
  ],
  TikTok: [
    { label: 'Conversions', value: 'conv' },
    { label: 'Reach', value: 'reach' },
    { label: 'Engagement', value: 'eng' },
  ],
  LinkedIn: [
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Traffic', value: 'trfc' },
    { label: 'Brand Awareness', value: 'awr' },
  ],
};

const AD_TYPES: Record<string, { label: string; value: string }[]> = {
  Facebook: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
    { label: 'Dynamic Creative (DCO)', value: 'dyn' },
    { label: 'GIF', value: 'gif' },
  ],
  'Google Ads': [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
  ],
  'Microsoft Ads': [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
  ],
  TikTok: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
  ],
  LinkedIn: [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Text', value: 'txt' },
  ],
};

export default function Home() {
  // -------- Input States --------
  const [platform, setPlatform] = useState('');
  const [product, setProduct] = useState('');
  const [campType, setCampType] = useState('');
  const [campTheme, setCampTheme] = useState('');
  const [campDate, setCampDate] = useState('');

  const [adSetTheme, setAdSetTheme] = useState('');
  const [targetingType, setTargetingType] = useState('');
  const [countries, setCountries] = useState('');
  const [stateZip, setStateZip] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');
  const [matchType, setMatchType] = useState('');
  const [adsetDate, setAdsetDate] = useState('');

  const [adType, setAdType] = useState('');
  const [adTheme, setAdTheme] = useState('');
  const [adDate, setAdDate] = useState('');

  // -------- Output States --------
  const [campaignName, setCampaignName] = useState('na_na_na');
  const [adSetName, setAdSetName]       = useState('na');
  const [adName, setAdName]             = useState('na');
  const [utmString, setUtmString]       = useState('');
  const [finalUrl, setFinalUrl]         = useState('');

  // -------- Real-time Generation --------
  useEffect(() => {
    const seg = (v: string) => (sanitizeText(v) || 'na').replace(/\s+/g, '+');
    const prod = seg(product);
    const type = campType || 'na';
    const theme = campTheme ? seg(campTheme) : 'na';

    // Campaign
    setCampaignName(`${prod}_${type}_${theme}`);

    // Ad Set
    const tgt = targetingType || 'na';
    const ctr = countries || 'na';
    const sz  = stateZip ? seg(stateZip) : 'na';
    const age = `${ageMin || 'na'}-${ageMax || 'na'}`;
    const gen = gender || 'na';
    const lang= language || 'na';
    const mt  = matchType || 'na';
    const asd = adsetDate ? formatToDDMMYY(adsetDate) : 'na';
    const ast = adSetTheme ? seg(adSetTheme) : 'na';
    setAdSetName(
      `${prod}_${type}_${tgt}_${ctr}_${sz}_${age}_${gen}_${lang}_${mt}_${asd}_${ast}`
    );

    // Ad
    const at  = adType || 'na';
    const adt = adDate ? formatToDDMMYY(adDate) : 'na';
    const adh = adTheme ? seg(adTheme) : 'na';
    setAdName(`${prod}_${type}_${theme}_${at}_${adt}_${adh}`);
  }, [
    product, campType, campTheme, campDate,
    adSetTheme, targetingType, countries, stateZip,
    ageMin, ageMax, gender, language, matchType, adsetDate,
    adType, adTheme, adDate
  ]);

  // -------- UTM Generation --------
  function generateUTM() {
    if (!platform) {
      const notif = document.createElement('div');
      notif.innerText = 'Please Choose Platform';
      notif.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded';
      document.body.appendChild(notif);
      setTimeout(() => document.body.removeChild(notif), 3000);
      return;
    }
    let utm = '';
    switch (platform) {
      case 'Facebook':
        utm = `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_ad={{ad.name}}&cid={{campaign.id}}&asid={{adset.id}}&aid={{ad.id}}&fsource={{site_source_name}}&placement={{placement}}`;
        break;
      case 'Google Ads':
        utm = `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_adset={_adset}&utm_ad={_ad}&utm_term={keyword}&adpos={adposition}&device={device}&creative={creative}&placement={placement}&cid={campaignid}&asid={adgroupid}&kmt={matchtype}&net={network}&device_model={devicemodel}&target={targetid}`;
        break;
      case 'Microsoft Ads':
        utm = `{lpurl}?utm_source=bing&utm_medium=cpc&cid={CampaignId}&utm_campaign={Campaign}&asid={AdGroupId}&utm_adset={AdGroup}&aid={AdId}&kmt={MatchType}&utm_term={keyword:default}-{QueryString}&target={TargetId}&net={Network}&device={Device}`;
        break;
      case 'TikTok':
        utm = `utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_NAME__&utm_adset=__AID_NAME__&utm_ad=__CID_NAME__&cid=__CAMPAIGN_ID__&asid=__AID__&aid=__CID__&placement=__PLACEMENT__&ttclid=__CLICKID__`;
        break;
      case 'LinkedIn':
        utm = `utm_source=linkedin&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`;
        break;
    }
    setUtmString(utm);
  }

  // -------- Final URL Generation --------
  function generateURL() {
    const inp = document.getElementById('landing-page') as HTMLInputElement;
    if (!inp.value) return alert('Please enter Landing Page URL');
    const sep = inp.value.includes('?') ? '&' : '?';
    setFinalUrl(`${inp.value}${sep}${utmString}`);
  }

  // -------- Render --------
  return (
    <div className="min-h-screen grid grid-cols-2 gap-8 p-8 bg-gray-900 text-gray-100">
      {/* LEFT COLUMN */}
      <div className="space-y-10">
        {/* Campaign Name */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Campaign Name</h2>
          <label className="block mt-4">Platform ⓘ</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="">Select Platform</option>
            {Object.keys(CAMPAIGN_TYPES).map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <label className="block mt-4">Product ⓘ</label>
          <input value={product} onChange={e => setProduct(e.target.value)}
            placeholder="Enter product"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2" />

          <label className="block mt-4">Campaign Type ⓘ</label>
          <select value={campType} onChange={e => setCampType(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2"
            disabled={!platform}>
            <option value="">Select type</option>
            {(CAMPAIGN_TYPES[platform]||[]).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <label className="block mt-4">Campaign Theme ⓘ (optional)</label>
          <input value={campTheme} onChange={e => setCampTheme(e.target.value)}
            placeholder="Enter theme"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2" />

          <label className="block mt-4">Campaign Date ⓘ (optional)</label>
          <input type="date" value={campDate} onChange={e => setCampDate(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 pr-10" />
        </div>

        {/* Ad Set Name */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Ad Set Name</h2>
          <label className="block mt-4">Ad Set Theme ⓘ (optional)</label>
          <input value={adSetTheme} onChange={e => setAdSetTheme(e.target.value)}
            placeholder="Enter ad set theme"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2" />

          <label className="block mt-4">Targeting Type ⓘ</label>
          <select value={targetingType} onChange={e => setTargetingType(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="">Select targeting</option>
            <option value="lal">Lookalike</option>
            <option value="rem">Remarketing</option>
            <option value="wide">Wide</option>
          </select>

          <label className="block mt-4">Countries ⓘ</label>
          <input value={countries} onChange={e => setCountries(e.target.value)}
            placeholder="e.g. us-il"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2" />

          <label className="block mt-4">State/City/Zip ⓘ (optional)</label>
          <input value={stateZip} onChange={e => setStateZip(e.target.value)}
            placeholder="Enter state/city/zip"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2" />

          <label className="block mt-4">Age Range ⓘ (optional)</label>
          <div className="flex space-x-2">
            <input type="number" value={ageMin} onChange={e => setAgeMin(e.target.value)}
              placeholder="Min" min={18} max={65}
              className="w-1/2 bg-gray-700 border border-gray-600 rounded p-2" />
            <input type="number" value={ageMax} onChange={e => setAgeMax(e.target.value)}
              placeholder="Max" min={18} max={65}
              className="w-1/2 bg-gray-700 border border-gray-600 rounded p-2" />
          </div>

          <label className="block mt-4">Gender ⓘ</label>
          <select value={gender} onChange={e => setGender(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="na">all</option>
            <option value="f">female</option>
            <option value="m">male</option>
          </select>

          <label className="block mt-4">Language ⓘ</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="na">all</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="il">Hebrew</option>
            <option value="fr">French</option>
            <option value="ro">Romanian</option>
            <option value="ar">Arabic</option>
            <option value="ru">Russian</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
          </select>

          <label className="block mt-4">Match Type ⓘ (optional)</label>
          <select value={matchType} onChange={e => setMatchType(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="na">na</option>
            <option value="exact">exact</option>
            <option value="phrase">phrase</option>
            <option value="broad">broad</option>
          </select>

          <label className="block mt-4">Adset Date ⓘ (optional)</label>
          <input type="date" value={adsetDate} onChange={e => setAdsetDate(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 pr-10" />
        </div>

        {/* Ad Name */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Ad Name</h2>
          <label className="block mt-4">Ad Type ⓘ</label>
          <select value={adType} onChange={e => setAdType(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2"
            disabled={!platform}>
            <option value="">Select ad type</option>
            {(AD_TYPES[platform]||[]).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <label className="block mt-4">Ad Theme ⓘ (optional)</label>
          <input value={adTheme} onChange={e => setAdTheme(e.target.value)}
            placeholder="Enter ad theme"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2" />

          <label className="block mt-4">Ad Date ⓘ (optional)</label>
          <input type="date" value={adDate} onChange={e => setAdDate(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 pr-10" />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-10">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Final Result</h2>
          <div className="mt-4 break-all">{campaignName} <button>📋</button></div>
          <div className="mt-2 break-all">{adSetName} <button>📋</button></div>
          <div className="mt-2 break-all">{adName} <button>📋</button></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">UTM Generator</h2>
          <button onClick={generateUTM}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Generate
          </button>
          <div className="mt-4 break-all">{utmString} <button>📋</button></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Landing Page URL</h2>
          <input id="landing-page" placeholder="https://www.cnn.com/"
            className="mt-2 w-full bg-gray-700 rounded p-2 border border-gray-600" />
          <button onClick={generateURL}
                  className="mt-3 bg-green-500 text-white px-4 py-2 rounded">
            Generate
          </button>
          <div className="mt-4 break-all">{finalUrl} <button>📋</button></div>
        </div>
      </div>
    </div>
  );
}
