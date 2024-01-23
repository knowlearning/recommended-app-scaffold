export default async function (id) {
  const [ metadata, content, state ] = await Promise.all([
    Agent.metadata(id),
    Agent.state(id),
    Agent.state(`${id}/draw-state`)
  ])

  if (metadata.active_type === 'application/json;type=drawing-prompt') {

  }
  else if(metadata.active_type === 'application/json;type=dashboard-config') {
    document.body.appendChild(
      document.createTextNode("Dashboard Config Data:" + JSON.stringify(content, null, 4))
    )
  }
  else {
    document.body.innerHTML = `<h1>${window.location.host} cannot play content of this type</h1>`
  }
}