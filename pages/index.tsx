// pages/index.tsx

import { useState, useEffect } from 'react';
import sanitizeText from '../utils/sanitizeText';
import formatToDDMMYY from '../utils/formatToDDMMYY';

export default function Home() {
  // Inputs
  const [platform, setPlatform] = useState<string>('');
  const [product, setProduct] = useState<string>('');
  const [campType, setCampType] = useState<string>('');
  const [campTheme, setCampTheme] = useState<string>('');
  const [campDate, setCampDate] = useState<string>('');

  // Ad Set inputs
  const [adSetTheme, setAdSetTheme] = useState<string>('');
  const [targetingType, setTargetingType] = useState<string>('');
  const [countries, setCountries] = useState<string>('na');
  const [stateZip, setStateZip] = useState<string>('');
  const [ageMin, setAgeMin] = useState<string>('na');
  const [ageMax, setAgeMax] = useState<string>('na');
  const [gender, setGender] = useState<string>('na');
  const [language, setLanguage] = useState<string>('na');
  const [matchType, setMatchType] = useState<string>('na');
  const [adsetDate, setAdsetDate] = useState<string>('');

  // Ad inputs
  const [adType, setAdType] = useState<string>('');
  const [adTheme, setAdTheme] = useState<string>('');
  const [adDate, setAdDate] = useState<string>('');

  // Outputs
  const [campaignName, setCampaignName] = useState<string>('na_na_na');
  const [adSetName, setAdSetName] = useState<string>('na');
  const [adName, setAdName] = useState<string>('na');
  const [utmString, setUtmString] = useState<string>('');
  const [finalUrl, setFinalUrl] = useState<string>('');

  // Real-time name generation
  useEffect(() => {
    const seg = (val: string) =>
      (sanitizeText(val) || 'na').replace(/\s+/g, '+');

    const prod = seg(product);
    const type = campType || 'na';
    const theme = campTheme ? seg(campTheme) : 'na';

    // Campaign Name
    setCampaignName(`${prod}_${type}_${theme}`);

    // Ad Set Name
    const tgt = targetingType || 'na';
    const ctr = countries || 'na';
    const sz = stateZip ? seg(stateZip) : 'na';
    const age = `${ageMin || 'na'}-${ageMax || 'na'}`;
    const gen = gender || 'na';
    const lang = language || 'na';
    const match = matchType || 'na';
    const asd = adsetDate ? formatToDDMMYY(adsetDate) : 'na';
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
    product, campType, campTheme, adSetTheme,
    targetingType, countries, stateZip, ageMin, ageMax,
    gender, language, matchType, adsetDate,
    adType, adTheme, adDate
  ]);

  // UTM Generation
  function generateUTM() {
    if (!platform) {
      // show a temporary notification
      const n = document.createElement('div');
      n.textContent = 'Please Choose Platform';
      n.className =
        'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg';
      document.body.appendChild(n);
      setTimeout(() => document.body.removeChild(n), 3000);
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
        // define with your new fields or ask if missing
        utm = `utm_source=linkedin&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`;
        break;
    }
    setUtmString(utm);
  }

  // Final URL Generation
  function generateURL() {
    const input = document.getElementById(
      'landing-page'
    ) as HTMLInputElement;
    if (!input.value) return alert('Please enter Landing Page URL');
    const sep = input.value.includes('?') ? '&' : '?';
    setFinalUrl(`${input.value}${sep}${utmString}`);
  }

  return (
    <div className="min-h-screen grid grid-cols-2 gap-8 p-8 bg-gray-900 text-gray-100">
      {/* LEFT COLUMN */}
      <div className="space-y-10">
        {/* Campaign Name */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">
            Campaign Name
          </h2>
          <label className="block mt-4">
            Product ⓘ
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Enter product"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2"
          />

          <label className="block mt-4">
            Campaign Type ⓘ
          </label>
          <select
            value={campType}
            onChange={(e) => setCampType(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2"
          >
            <option value="">Select type</option>
            <option value="conv">Conversions</option>
            <option value="lg">Leads</option>
            <option value="reach">Reach</option>
            <option value="trfc">Traffic</option>
            <option value="eng">Engagement</option>
            <option value="vv">Video Views</option>
            <option value="msg">Messages</option>
            <option value="bst">Boost</option>
          </select>

          <label className="block mt-4">
            Campaign Theme ⓘ (optional)
          </label>
          <input
            type="text"
            value={campTheme}
            onChange={(e) => setCampTheme(e.target.value)}
            placeholder="Enter theme"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2"
          />

          <label className="block mt-4">
            Campaign Date ⓘ (optional)
          </label>
          <input
            type="date"
            value={campDate}
            onChange={(e) => setCampDate(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 pr-10"
          />
        </div>

        {/* Ad Set Name */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">
            Ad Set Name
          </h2>
          <input
            type="text"
            value={adSetTheme}
            onChange={(e) => setAdSetTheme(e.target.value)}
            placeholder="Ad Set theme (optional)"
            className="mt-2 w-full bg-gray-700 border border-gray-600 rounded p-2"
          />

          <label className="block mt-4">Targeting Type ⓘ</label>
          <select
            value={targetingType}
            onChange={(e) => setTargetingType(e.target.value)}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2"
          >
            <option value="">Select targeting</option>
            <option value="lal">Lookalike</option>
            <option value="rem">Remarketing</option>
            <option value="wide">Wide</option>
          </select>

          <input
            type="text"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            placeholder="Countries (e.g. us-il)"
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded p-2"
          />

          <input
            type="text"
            value={stateZip}
            onChange={(e) => setStateZip(e.target.value)}
            placeholder="State/City/Zip (optional)"
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded p-2"
          />

          <div className="mt-4 flex space-x-2">
            <input
              type="number"
              value={ageMin === 'na' ? '' : ageMin}
              onChange={(e) => setAgeMin(e.target.value || 'na')}
              placeholder="Min"
              className="w-1/2 bg-gray-700 border border-gray-600 rounded p-2"
              min={18}
              max={65}
            />
            <input
              type="number"
              value={ageMax === 'na' ? '' : ageMax}
              onChange={(e) => setAgeMax(e.target.value || 'na')}
              placeholder="Max"
              className="w-1/2 bg-gray-700 border border-gray-600 rounded p-2"
              min={18}
              max={65}
            />
          </div>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded p-2"
          >
            <option value="na">all</option>
            <option value="f">f</option>
            <option value="m">m</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded p-2"
          >
            <option value="na">all</option>
            <option value="en">en</option>
            <option value="es">es</option>
            <option value="il">il</option>
            <option value="fr">fr</option>
            <option value="ro">ro</option>
            <option value="ar">ar</option>
            <option value="ru">ru</option>
            <option value="de">de</option>
            <option value="pt">pt</option>
          </select>

          <select
            value={matchType}
            onChange={(e) => setMatchType(e.target.value)}
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded p-2"
          >
            <option value="na">na</option>
            <option value="exact">exact</option>
            <option value="phrase">phrase</option>
            <option value="broad">broad</option>
          </select>

          <input
            type="date"
            value={adsetDate}
            onChange={(e) => setAdsetDate(e.target.value)}
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded p-2 pr-10"
          />
        </div>

        {/* Ad Name */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Ad Name</h2>
          <select
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            className="mt-2 w-full bg-gray-700 border border-gray-600 rounded p-2"
          >
            <option value="">Select ad type</option>
            <option value="img">img</option>
            <option value="vid">vid</option>
            <option value="crsel">crsel</option>
            <option value="dyn">dyn</option>
            <option value="gif">gif</option>
          </select>

          <input
            type="text"
            value={adTheme}
            onChange={(e) => setAdTheme(e.target.value)}
            placeholder="Ad theme (optional)"
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded p-2"
          />

          <input
            type="date"
            value={adDate}
            onChange={(e) => setAdDate(e.target.value)}
            className="mt-4 w-full bg-gray-700 border border-gray-600 rounded p-2 pr-10"
          />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-10">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">Final Result</h2>
          <div className="mt-4 break-all">
            {campaignName} <button>📋</button>
          </div>
          <div className="mt-2 break-all">
            {adSetName} <button>📋</button>
          </div>
          <div className="mt-2 break-all">
            {adName} <button>📋</button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">UTM Generator</h2>
          <button
            onClick={generateUTM}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Generate
          </button>
          <div className="mt-4 break-all">
            {utmString} <button>📋</button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-green-400 text-lg font-semibold">
            Landing Page URL
          </h2>
          <input
            id="landing-page"
            type="url"
            placeholder="https://www.cnn.com/"
            className="mt-2 w-full bg-gray-700 border border-gray-600 rounded p-2"
          />
          <button
            onClick={generateURL}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
          >
            Generate
          </button>
          <div className="mt-4 break-all">
            {finalUrl} <button>📋</button>
          </div>
        </div>
      </div>
    </div>
  );
}
