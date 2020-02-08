const JSON_SOURCE = "https://stream.djmicrobeat.com:8443/status-json.xsl";

export default async function() {
  return fetch(JSON_SOURCE).then(res => res.json());
}
