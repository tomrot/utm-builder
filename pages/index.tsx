// pages/index.tsx
import { useState, useEffect } from 'react';
import sanitizeText from '../utils/sanitizeText';
import formatToDDMMYY from '../utils/formatToDDMMYY';

export default function Home() {
  // === INPUT STATES ===
  const [platform, setPlatform] = useState('');
  const [product, setProduct]   = useState('');
  const [campType, setCampType] = useState('');
  const [campTheme, setCampTheme] = useState('');
  const [campDate, setCampDate] = useState('');

  // Ad Set inputs
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

  // Ad inputs
  const [adType, setAdType] = useState('');
  const [adTheme, setAdTheme] = useState('');
  const [adDate, setAdDate] = useState('');

  // === OUTPUT STATES ===
  const [campaignName, setCampaignName] = useState('na_na_na');
  const [adSetName, setAdSetName] = useState('na');
  const [adName, setAdName] = useState('na');
  const [utmString, setUtmString] = useState('');
  const [finalUrl, setFinalUrl] = useState('');

  // === REAL-TIME GENERATION ===
  useEffect(() => {
    const seg = (v: string) => (sanitizeText(v) || 'na').replace(/\s+/g,'+');
    const prod = seg(product), type = campType || 'na', theme = seg(campTheme);
    const date = campDate ? formatToDDMMYY(campDate) : 'na';

    // Campaign Name
    setCampaignName(`${prod}_${type}_${theme}`);

    // Ad Set Name
    const tgt = targetingType || 'na';
    const ctr = countries  || 'na';
    const sz  = stateZip   ? seg(stateZip) : 'na';
    const age = `${ageMin||'na'}-${ageMax||'na'}`;
    const gen = gender     || 'na';
    const lang= language   || 'na';
    const match= matchType || 'na';
    const asd = adsetDate  ? formatToDDMMYY(adsetDate) : 'na';
    const ast = adSetTheme ? seg(adSetTheme) : 'na';

    setAdSetName(
      `${prod}_${type}_${tgt}_${ctr}_${sz}_${age}_${gen}_${lang}_${match}_${asd}_${ast}`
    );

    // Ad Name
    const at = adType || 'na';
    const adt = adDate ? formatToDDMMYY(adDate) : 'na';
    const ath = adTheme ? seg(adTheme) : 'na';

    setAdName(`${prod}_${type}_${theme}_${at}_${adt}_${ath}`);
  }, [
    product, campType, campTheme, campDate,
    adSetTheme, targetingType, countries, stateZip, ageMin, ageMax,
    gender, language, matchType, adsetDate,
    adType, adTheme, adDate
  ]);

  // === UTM GENERATOR ===
  function generateUTM() {
    if (!platform) {
      const n = document.createElement('div');
      n.textContent = 'Please Choose Platform';
      n.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded';
      document.body.appendChild(n);
      setTimeout(()=>document.body.removeChild(n),3000);
      return;
    }
    let utm = '';
    switch(platform) {
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

  // === FINAL URL ===
  function generateURL() {
    const inp = document.getElementById('landing-page') as HTMLInputElement;
    if (!inp.value) return alert('Please enter Landing Page URL');
    const sep = inp.value.includes('?') ? '&' : '?';
    setFinalUrl(`${inp.value}${sep}${utmString}`);
  }

  return (
    <div className="min-h-screen grid grid-cols-2 gap-8 p-8 bg-gray-900 text-gray-100">
      {/* LEFT */}
      <div className="space-y-10">
        {/* Campaign */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Campaign Name</h2>
          <label className="block mt-4">Platform ⓘ</label>
          <select value={platform} onChange={e=>setPlatform(e.target.value)}
                  className="mt-1 w-full bg-gray-700 rounded p-2 border-gray-600">
            <option value="">Select Platform</option>
            <option>Facebook</option>
            <option>Google Ads</option>
            <option>Microsoft Ads</option>
            <option>TikTok</option>
            <option>LinkedIn</option>
          </select>

          <label className="block mt-4">Product ⓘ</label>
          <input value={product} onChange={e=>setProduct(e.target.value)}
                 className="mt-1 w-full bg-gray-700 rounded p-2 border-gray-600"
                 placeholder="Enter product" />

          <label className="block mt-4">Campaign Type ⓘ</label>
          <select value={campType} onChange={e=>setCampType(e.target.value)}
                  className="mt-1 w-full bg-gray-700 rounded p-2 border-gray-600">
            <option value="">Select type</option>
            <option value="conv">conv</option>
            <option value="lg">lg</option>
            <option value="reach">reach</option>
            <option value="trfc">trfc</option>
            <option value="eng">eng</option>
            <option value="vv">vv</option>
            <option value="msg">msg</option>
            <option value="bst">bst</option>
          </select>

          <label className="block mt-4">Campaign Theme ⓘ (optional)</label>
          <input value={campTheme} onChange={e=>setCampTheme(e.target.value)}
                 className="mt-1 w-full bg-gray-700 rounded p-2 border-gray-600"
                 placeholder="Enter theme" />

          <label className="block mt-4">Campaign Date ⓘ (optional)</label>
          <input type="date" value={campDate} onChange={e=>setCampDate(e.target.value)}
                 className="mt-1 w-full bg-gray-700 rounded p-2 border-gray-600 pr-10" />
        </div>

        {/* Ad Set */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Ad Set Name</h2>
          {/* repeat inputs as above... */}
        </div>

        {/* Ad */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Ad Name</h2>
          {/* repeat inputs */}
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-10">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Final Result</h2>
          <div className="mt-4 break-all">{campaignName} <button>📋</button></div>
          <div className="mt-2 break-all">{adSetName} <button>📋</button></div>
          <div className="mt-2 break-all">{adName} <button>📋</button></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">UTM Generator</h2>
          <button onClick={generateUTM} className="mt-2 bg-green-500 px-4 py-2 rounded">Generate</button>
          <div className="mt-4 break-all">{utmString} <button>📋</button></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Landing Page URL</h2>
          <input id="landing-page" placeholder="https://www.cnn.com/"
                 className="mt-2 w-full bg-gray-700 rounded p-2 border-gray-600" />
          <button onClick={generateURL} className="mt-3 bg-green-500 px-4 py-2 rounded">Generate</button>
          <div className="mt-4 break-all">{finalUrl} <button>📋</button></div>
        </div>
      </div>
    </div>
  );
}
