import { useState, useEffect } from 'react';
import type { CognitoParams } from './types';

const SCOPE_OPTIONS = [
  "openid",
  "email",
  "phone",
  "profile",
  "aws.cognito.signin.user.admin",
];

export default function App() {
  const faviconSrc = `${import.meta.env.BASE_URL}favicon.svg`;
  const [darkMode, setDarkMode] = useState(false);
  const [rawUrl, setRawUrl] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [params, setParams] = useState<CognitoParams>({
    response_type: "code",
    client_id: "",
    redirect_uri: "",
    scope: [],
    identity_provider: "",
  });
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode min-h-screen" : "min-h-screen";
  }, [darkMode]);

  /** Parse pasted Hosted UI URL */
  function parseUrl(url: string) {
    try {
      const u = new URL(url);
      setBaseUrl(u.origin + u.pathname);

      const scope = u.searchParams.get("scope");
      setParams({
        response_type: (u.searchParams.get("response_type") || "code") as 'code' | 'token',
        client_id: u.searchParams.get("client_id") || "",
        redirect_uri: u.searchParams.get("redirect_uri") || "",
        scope: scope ? scope.split(/[ +]/) : [],
        identity_provider: u.searchParams.get("identity_provider") || "",
      });
    } catch (e) {
      // Silently fail if URL is partial/invalid during typing
    }
  }

  /** Generate final Hosted UI URL */
  function generateUrl() {
    if (!baseUrl || !params.client_id || !params.redirect_uri) {
      alert("Please fill in the required fields: Base URL, Client ID, and Redirect URI.");
      return;
    }

    try {
      const url = new URL(baseUrl.includes("?") ? baseUrl.split("?")[0] : baseUrl);
      url.searchParams.set("response_type", params.response_type);
      url.searchParams.set("client_id", params.client_id);
      url.searchParams.set("redirect_uri", params.redirect_uri);

      if (params.scope.length > 0) {
        url.searchParams.set("scope", params.scope.join(" "));
      }

      if (params.identity_provider) {
        url.searchParams.set("identity_provider", params.identity_provider);
      }

      // Convert %20 to + for Cognito standard
      const finalUrl = url.toString().replace(/%20/g, "+");
      setGeneratedUrl(finalUrl);
    } catch (e) {
      alert("Invalid Base URL format.");
    }
  }

  function toggleScope(scope: string) {
    setParams((p) => ({
      ...p,
      scope: p.scope.includes(scope)
        ? p.scope.filter((s) => s !== scope)
        : [...p.scope, scope],
    }));
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopyStatus("✓ Copied!");
    setTimeout(() => setCopyStatus("Copy"), 2000);
  };

  return (
    <div>
      {/* Header with Dark Mode Toggle */}
      <div className="sticky-header py-2 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <img src={faviconSrc} alt="cognito-logo" className="h-9 w-9 rounded-md" />
              </div>
              <div>
                <h1 className={`text-lg sm:text-xl font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  AWS Cognito Hosted UI
                </h1>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Parse, edit, and generate authorization URLs
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-slate-700/80 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
              title="Toggle dark mode"
            >
              <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-5">
        {/* URL Input Section */}
        <div className="glass-card rounded-xl p-4 sm:p-5 mb-4 fade-in">
          <label className={`block font-semibold mb-2.5 flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            <span className="text-lg">📋</span>
            Paste Hosted UI URL
          </label>
          <textarea
            className={`w-full p-3 rounded-lg input-field font-mono text-sm ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-900'}`}
            rows={2}
            placeholder="https://your-domain.auth.region.amazoncognito.com/login?..."
            value={rawUrl}
            onChange={(e) => {
              setRawUrl(e.target.value);
              parseUrl(e.target.value);
            }}
          />
        </div>

        {/* Configuration Form */}
        <div className="glass-card rounded-xl p-4 sm:p-5 mb-4 fade-in">
          <h2 className={`text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-xs">1</span>
            Configuration Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* response_type */}
            <div>
              <label className={`block font-semibold mb-1.5 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Response Type *
              </label>
              <select
                className={`w-full p-2.5 rounded-lg input-field ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-900'}`}
                value={params.response_type}
                onChange={(e) =>
                  setParams({ ...params, response_type: e.target.value as 'code' | 'token' })
                }
              >
                <option value="code">code (Authorization Code Grant)</option>
                <option value="token">token (Implicit Grant)</option>
              </select>
            </div>

            {/* client_id */}
            <div>
              <label className={`block font-semibold mb-1.5 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Client ID *
              </label>
              <input
                className={`w-full p-2.5 rounded-lg input-field font-mono ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-900'}`}
                placeholder="Enter App Client ID"
                value={params.client_id}
                onChange={(e) =>
                  /^[a-zA-Z0-9]*$/.test(e.target.value) &&
                  setParams({ ...params, client_id: e.target.value })
                }
              />
            </div>

            {/* redirect_uri */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className={`block font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Redirect URI *
                </label>
                <button
                  className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${darkMode ? 'text-sky-300 hover:bg-slate-800' : 'text-sky-700 hover:bg-sky-50'}`}
                  onClick={() =>
                    setParams({
                      ...params,
                      redirect_uri: "https://oidcdebugger.com/debug",
                    })
                  }
                >
                  Use OIDC Debugger
                </button>
              </div>
              <input
                className={`w-full p-2.5 rounded-lg input-field ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-900'}`}
                placeholder="https://example.com/callback"
                value={params.redirect_uri}
                onChange={(e) =>
                  setParams({ ...params, redirect_uri: e.target.value })
                }
              />
            </div>

            {/* scope */}
            <div className="md:col-span-2">
              <label className={`block font-semibold mb-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Scopes
              </label>
              <div className="flex flex-wrap gap-2">
                {SCOPE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleScope(s)}
                    className={`scope-chip px-3 py-1.5 rounded-full text-sm font-medium border ${
                      params.scope.includes(s)
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow'
                        : darkMode
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* identity_provider */}
            <div className="md:col-span-2">
              <label className={`block font-semibold mb-1.5 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Identity Provider (Optional)
              </label>
              <input
                className={`w-full p-2.5 rounded-lg input-field ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-900'}`}
                placeholder="e.g., Google, SAML, LoginWithAmazon"
                value={params.identity_provider}
                onChange={(e) =>
                  setParams({
                    ...params,
                    identity_provider: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            className="w-full mt-5 btn-primary text-white font-semibold py-2.5 px-4 rounded-lg shadow"
            onClick={generateUrl}
          >
            Generate Hosted UI URL
          </button>
        </div>

        {/* Output Section */}
        {generatedUrl && (
          <div className="glass-card rounded-xl p-4 sm:p-5 fade-in">
            <label className={`block font-bold mb-2.5 text-base sm:text-lg flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              <span className="text-lg">✨</span>
              Generated URL
            </label>
            <textarea
              className={`w-full p-3 rounded-lg font-mono text-sm mb-3 ${
                darkMode
                  ? 'bg-slate-900 text-emerald-300 border border-slate-700'
                  : 'bg-slate-900 text-emerald-300 border border-slate-300'
              }`}
              rows={3}
              readOnly
              value={generatedUrl}
            />
            <div className="flex flex-wrap gap-2">
              <button
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
                onClick={copyToClipboard}
              >
                {copyStatus}
              </button>
              <button
                className="flex-1 btn-primary text-white py-2.5 px-4 rounded-lg font-medium shadow"
                onClick={() => window.open(generatedUrl, "_blank")}
              >
                Open in New Tab
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="sticky-footer py-1.5 px-3 sm:px-4">
        <div className={`max-w-4xl mx-auto text-center text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <p className="mb-1">Developed by Hanoj Budime · 2025-2026</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="https://github.com/hanoj-budime/react-cognito-hosted-ui-editor/issues"
              target="_blank"
              rel="noreferrer"
              className={`hover:underline ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}
            >
              Report Issue on GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/hanoj-budime"
              target="_blank"
              rel="noreferrer"
              className={`hover:underline ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}
            >
              Connect on LinkedIn
            </a>
            <a
              href="https://github.com/hanoj-budime"
              target="_blank"
              rel="noreferrer"
              className={`hover:underline ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}
            >
              View GitHub Profile
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
