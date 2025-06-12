// pages/index.tsx
import { useState, useEffect } from 'react';
import sanitizeText from '../utils/sanitizeText';
import formatToDDMMYY from '../utils/formatToDDMMYY';

const PLATFORMS = [
  'Facebook',
  'Google Ads',
  'Microsoft Ads',
  'TikTok',
  'LinkedIn',
] as const;

const CAMPAIGN_TYPES: Record<string, { label: string; value: string }[]> = {
  'Facebook': [
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
  'TikTok': [
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Reach', value: 'reach' },
    { label: 'Traffic', value: 'trfc' },
    { label: 'Video Views', value: 'vv' },
  ],
  'LinkedIn': [
    { label: 'Conversions', value: 'conv' },
    { label: 'Lead Generation', value: 'lg' },
    { label: 'Brand Awareness', value: 'awr' },
    { label: 'Website Visits (Traffic)', value: 'trfc' },
    { label: 'Engagement', value: 'eng' },
    { label: 'Video Views', value: 'vv' },
  ],
};

const AD_TYPES: Record<string, { label: string; value: string }[]> = {
  'Facebook': [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
    { label: 'Dynamic Creative Ad (DCO)', value: 'dyn' },
    { label: 'GIF', value: 'gif' },
  ],
  'Google Ads': [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
    { label: 'Responsive Search Ad', value: 'rsa' },
    // …add as needed
  ],
  'Microsoft Ads': [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
  ],
  'TikTok': [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
  ],
  'LinkedIn': [
    { label: 'Image', value: 'img' },
    { label: 'Video', value: 'vid' },
    { label: 'Carousel', value: 'crsel' },
    { label: 'Text', value: 'txt' },
    { label: 'Conversation', value: 'con' },
    { label: 'Spotlight', value: 'spt' },
    { label: 'Message', value: 'msg' },
  ],
};

// Country codes per spec
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
];

const TARGETING = [
  { label: 'Lookalike', value: 'lal' },
  { label: 'Remarketing', value: 'rem' },
  { label: 'Wide (prospecting)', value: 'wide' },
];

const GENDERS = [
  { label: 'All', value: 'all' },
  { label: 'Female/Woman', value: 'f' },
  { label: 'Male/Man', value: 'm' },
];

const LANGUAGES = [
  { label: 'All', value: 'all' },
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'Hebrew', value: 'he' },
];

const MATCH_TYPES = [
  { label: 'na', value: 'na' },
  { label: 'Exact', value: 'exact' },
  { label: 'Phrase', value: 'phrase' },
  { label: 'Broad', value: 'broad' },
];

// Age options 18–65+
const AGE_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) =>
  (18 + i).toString()
).concat(['65+']);

export default function Home() {
  // — Inputs —
  const [platform, setPlatform] = useState<string>('');
  const [product, setProduct] = useState<string>('');
  const [campType, setCampType] = useState<string>('');
  const [campTheme, setCampTheme] = useState<string>('');
  const [campDate, setCampDate] = useState<string>('');

  const [adSetTheme, setAdSetTheme] = useState<string>('');
  const [targeting, setTargeting] = useState<string>('');
  const [countries, setCountries] = useState<string[]>([]);
  const [scz, setScz] = useState<string>(''); // state/city/zip
  const [ageMin, setAgeMin] = useState<string>('');
  const [ageMax, setAgeMax] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [matchType, setMatchType] = useState<string>('');
  const [adsetDate, setAdsetDate] = useState<string>('');

  const [adType, setAdType] = useState<string>('');
  const [adTheme, setAdTheme] = useState<string>('');
  const [adDate, setAdDate] = useState<string>('');

  // — Outputs —
  const [campaignName, setCampaignName] = useState<string>('na_na_na');
  const [adSetName, setAdSetName] = useState<string>('na');
  const [adName, setAdName] = useState<string>('na');
  const [utm, setUtm] = useState<string>('');
  const [showNotif, setShowNotif] = useState<string>('');
  const [finalUrl, setFinalUrl] = useState<string>('');

  // — Generate names in real time —
  useEffect(() => {
    const seg = (val: string) =>
      (sanitizeText(val) || 'na').replace(/\s+/g, '+');
    const prodSeg = seg(product);
    const typeSeg = campType || 'na';
    const themeSeg = campTheme ? seg(campTheme) : 'na';

    setCampaignName([prodSeg, typeSeg, themeSeg].join('_'));

    const countriesSeg =
      countries.length === 0
        ? 'na'
        : countries.join('-');
    const sczSeg = scz ? seg(scz) : 'na';
    const ageSeg = `${ageMin || 'na'}-${ageMax || 'na'}`;
    const genderSeg = gender || 'na';
    const langSeg = language || 'na';
    const matchSeg = matchType || 'na';
    const adsetDateSeg = adsetDate
      ? formatToDDMMYY(adsetDate)
      : 'na';
    const adsetThemeSeg = adSetTheme
      ? seg(adSetTheme)
      : 'na';

    setAdSetName(
      [
        prodSeg,
        typeSeg,
        countriesSeg,
        sczSeg,
        ageSeg,
        genderSeg,
        langSeg,
        matchSeg,
        adsetDateSeg,
        adsetThemeSeg,
      ].join('_')
    );

    const adDateSeg = adDate
      ? formatToDDMMYY(adDate)
      : 'na';
    const adThemeSeg = adTheme
      ? seg(adTheme)
      : 'na';
    setAdName(
      [prodSeg, typeSeg, adType || 'na', adDateSeg, adThemeSeg].join('_')
    );
  }, [
    product,
    campType,
    campTheme,
    adSetTheme,
    targeting,
    countries,
    scz,
    ageMin,
    ageMax,
    gender,
    language,
    matchType,
    campDate,
    adsetDate,
    adType,
    adTheme,
    adDate,
  ]);

  // — UTM Generation handler —
  function handleGenerateUtm() {
    if (!platform) {
      setShowNotif('Please choose Platform');
      setTimeout(() => setShowNotif(''), 3000);
      return;
    }
    let str = '';
    switch (platform) {
      case 'Facebook':
        str = `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_ad={{ad.name}}&cid={{campaign.id}}&asid={{adset.id}}&aid={{ad.id}}&fsource={{site_source_name}}&placement={{placement}}`;
        break;
      case 'Google Ads':
        str = `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_adset={_adset}&utm_ad={_ad}&utm_term={keyword}&adpos={adposition}&device={device}&creative={creative}&placement={placement}&cid={campaignid}&asid={adgroupid}&kmt={matchtype}&net={network}&device_model={devicemodel}&target={targetid}`;
        break;
      case 'Microsoft Ads':
        str = `{lpurl}?utm_source=bing&utm_medium=cpc&cid={CampaignId}&utm_campaign={Campaign}&asid={AdGroupId}&utm_adset={AdGroup}&aid={AdId}&kmt={MatchType}&utm_term={keyword:default}-{QueryString}&target={TargetId}&net={Network}&device={Device}`;
        break;
      case 'TikTok':
        str = `utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_NAME__&utm_adset=__AID_NAME__&utm_ad=__CID_NAME__&cid=__CAMPAIGN_ID__&asid=__AID__&aid=__CID__&placement=__PLACEMENT__&ttclid=__CLICKID__`;
        break;
      case 'LinkedIn':
        str = `utm_source=linkedin&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`;
        break;
    }
    setUtm(str);
  }

  // — Final URL handler —
  function handleGenerateUrl() {
    const base = (document.getElementById(
      'landing-page'
    ) as HTMLInputElement).value.trim();
    if (!base) {
      setShowNotif('Please enter Landing Page URL');
      setTimeout(() => setShowNotif(''), 3000);
      return;
    }
    const sep = base.includes('?') ? '&' : '?';
    setFinalUrl(`${base}${sep}${utm}`);
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-2 gap-8">
      {/* — Left Column — */}
      <div className="space-y-6">
        {/* Campaign Name */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-lg font-semibold">
            Campaign Name
          </h3>
          {/* Platform */}
          <div>
            <label className="block mb-1">
              Platform <span title="Choose ad platform">ⓘ</span>
            </label>
            <select
              className="input"
              value={platform}
              onChange={e => {
                setPlatform(e.target.value);
                setCampType('');
                setAdType('');
              }}
            >
              <option value="">Select platform</option>
              {PLATFORMS.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          {/* Product */}
          <div>
            <label className="block mb-1">
              Product <span title="Avoid special chars. Use + or -">ⓘ</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter product"
              value={product}
              onChange={e => setProduct(e.target.value)}
            />
          </div>
          {/* Campaign Type */}
          <div>
            <label className="block mb-1">
              Campaign Type <span title="Select campaign objective">ⓘ</span>
            </label>
            <select
              className="input"
              disabled={!platform}
              value={campType}
              onChange={e => setCampType(e.target.value)}
            >
              <option value="">
                {platform ? 'Select campaign type' : 'Select platform first'}
              </option>
              {platform &&
                CAMPAIGN_TYPES[platform].map(o => (
                  <option key={o.value} value={o.value}>
                    {o.value}
                  </option>
                ))}
            </select>
          </div>
          {/* Campaign Theme */}
          <div>
            <label className="block mb-1">
              Campaign Theme (optional){' '}
              <span title="Optional. Avoid special chars.">ⓘ</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter theme"
              value={campTheme}
              onChange={e => setCampTheme(e.target.value)}
            />
          </div>
          {/* Campaign Date */}
          <div>
            <label className="block mb-1">
              Campaign Date (optional){' '}
              <span title="Optional. Format: DDMMYY">ⓘ</span>
            </label>
            <input
              type="date"
              className="input"
              value={campDate}
              onChange={e => setCampDate(e.target.value)}
            />
          </div>
        </div>

        {/* Ad Set Name */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-lg font-semibold">
            Ad Set Name
          </h3>
          {/* Ad Set Theme */}
          <div>
            <label className="block mb-1">
              Ad Set Theme (optional){' '}
              <span title="Optional. Appears at end of name.">ⓘ</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter ad set theme"
              value={adSetTheme}
              onChange={e => setAdSetTheme(e.target.value)}
            />
          </div>
          {/* Targeting */}
          <div>
            <label className="block mb-1">
              Targeting type <span title="Select one type">ⓘ</span>
            </label>
            <select
              className="input"
              value={targeting}
              onChange={e => setTargeting(e.target.value)}
            >
              <option value="">Select type</option>
              {TARGETING.map(o => (
                <option key={o.value} value={o.value}>
                  {o.value}
                </option>
              ))}
            </select>
          </div>
          {/* Countries */}
          <div>
            <label className="block mb-1">
              Countries <span title="Select one or more">ⓘ</span>
            </label>
            <select
              multiple
              className="input h-24"
              value={countries}
              onChange={e =>
                setCountries(
                  Array.from(e.target.selectedOptions, o => o.value)
                )
              }
            >
              {COUNTRIES.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {/* State/City/Zip */}
          <div>
            <label className="block mb-1">
              State/City/Zip(s) (optional){' '}
              <span title="Optional. Separate with -">ⓘ</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. CA-LosAngeles-90001"
              value={scz}
              onChange={e => setScz(e.target.value)}
            />
          </div>
          {/* Age */}
          <div>
            <label className="block mb-1">
              Age <span title="Optional. Select min & max">ⓘ</span>
            </label>
            <div className="flex space-x-4">
              <select
                className="input flex-1"
                value={ageMin}
                onChange={e => setAgeMin(e.target.value)}
              >
                <option value="">Min</option>
                {AGE_OPTIONS.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <select
                className="input flex-1"
                value={ageMax}
                onChange={e => setAgeMax(e.target.value)}
              >
                <option value="">Max</option>
                {AGE_OPTIONS.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Gender & Language */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1">
                Gender <span title="Optional">ⓘ</span>
              </label>
              <select
                className="input w-full"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                {GENDERS.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">
                Language <span title="Optional">ⓘ</span>
              </label>
              <select
                className="input w-full"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="">Select language</option>
                {LANGUAGES.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Match Type */}
          <div>
            <label className="block mb-1">
              Match Type (optional){' '}
              <span title="Optional. For search only.">ⓘ</span>
            </label>
            <select
              className="input"
              value={matchType}
              onChange={e => setMatchType(e.target.value)}
            >
              <option value="">Select match type</option>
              {MATCH_TYPES.map(o => (
                <option key={o.value} value={o.value}>
                  {o.value}
                </option>
              ))}
            </select>
          </div>
          {/* Adset Date */}
          <div>
            <label className="block mb-1">
              Ad Set Date (optional){' '}
              <span title="Optional. Format DDMMYY">ⓘ</span>
            </label>
            <input
              type="date"
              className="input"
              value={adsetDate}
              onChange={e => setAdsetDate(e.target.value)}
            />
          </div>
        </div>

        {/* Ad Name */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-lg font-semibold">Ad Name</h3>
          {/* Ad Type */}
          <div>
            <label className="block mb-1">
              Ad Type <span title="Select ad format">ⓘ</span>
            </label>
            <select
              className="input"
              disabled={!platform}
              value={adType}
              onChange={e => setAdType(e.target.value)}
            >
              <option value="">
                {platform ? 'Select ad type' : 'Select platform first'}
              </option>
              {platform &&
                AD_TYPES[platform].map(o => (
                  <option key={o.value} value={o.value}>
                    {o.value}
                  </option>
                ))}
            </select>
          </div>
          {/* Ad Theme */}
          <div>
            <label className="block mb-1">
              Ad Theme (optional){' '}
              <span title="Optional. Avoid special chars.">ⓘ</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter ad theme"
              value={adTheme}
              onChange={e => setAdTheme(e.target.value)}
            />
          </div>
          {/* Ad Date */}
          <div>
            <label className="block mb-1">
              Ad Date (optional){' '}
              <span title="Optional. Format DDMMYY">ⓘ</span>
            </label>
            <input
              type="date"
              className="input"
              value={adDate}
              onChange={e => setAdDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* — Right Column — */}
      <div className="space-y-6">
        {/* Final Result */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-lg font-semibold">
            Final Result
          </h3>
          <div>
            <h4 className="text-gray-400 text-sm">Campaign Name</h4>
            <div className="flex items-center space-x-2">
              <code className="break-all">{campaignName}</code>
              <button
                className="btn"
                onClick={() => {
                  navigator.clipboard.writeText(campaignName);
                  setShowNotif('Copied!');
                }}
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm">Ad Set Name</h4>
            <div className="flex items-center space-x-2">
              <code className="break-all">{adSetName}</code>
              <button
                className="btn"
                onClick={() => {
                  navigator.clipboard.writeText(adSetName);
                  setShowNotif('Copied!');
                }}
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm">Ad Name</h4>
            <div className="flex items-center space-x-2">
              <code className="break-all">{adName}</code>
              <button
                className="btn"
                onClick={() => {
                  navigator.clipboard.writeText(adName);
                  setShowNotif('Copied!');
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* UTM Generator */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-lg font-semibold">
            UTM Generator
          </h3>
          <textarea
            readOnly
            className="input break-all h-20"
            placeholder="No UTM generated yet."
            value={utm}
          />
          <div className="flex space-x-4">
            <button className="btn" onClick={handleGenerateUtm}>
              Generate
            </button>
            <button
              className="btn"
              onClick={() => {
                navigator.clipboard.writeText(utm);
                setShowNotif('Copied!');
              }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Landing Page URL */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-green-500 text-lg font-semibold">
            Landing Page URL
          </h3>
          <input
            id="landing-page"
            type="url"
            className="input"
            placeholder="https://www.cnn.com/"
          />
          <textarea
            readOnly
            className="input break-all h-20"
            placeholder="URL + UTM"
            value={finalUrl}
          />
          <div className="flex space-x-4">
            <button className="btn" onClick={handleGenerateUrl}>
              Generate
            </button>
            <button
              className="btn"
              onClick={() => {
                navigator.clipboard.writeText(finalUrl);
                setShowNotif('Copied!');
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Notification bubble */}
      {showNotif && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
          {showNotif}
        </div>
      )}
    </div>
  );
}
