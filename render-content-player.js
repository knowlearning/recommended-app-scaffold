export default async function (id) {
  const [ metadata, content, state ] = await Promise.all([
    Agent.metadata(id),
    Agent.state(id),
    Agent.state(`${id}/draw-state`)
  ])

  if (metadata.active_type === 'application/json;type=drawing-prompt') {
    if (state.plays === undefined) state.plays = 0
    state.plays += 1
    document.body.appendChild(
      document.createTextNode(`${content.prompt}. You've loaded this ${state.plays} times.`)
    )
  }
  else if(metadata.active_type === 'application/json;type=dashboard-config') {
    const drawingPromptId = Object.keys(content)[0]
    const drawingPrompt = await Agent.state(drawingPromptId)
    document.body.appendChild(
      document.createTextNode(`Prompt: ${drawingPrompt.prompt}`)
    )
    Object
      .entries(content[drawingPromptId])
      .forEach(renderUserRunState)
  }
  else {
    document.body.innerHTML = `<h1>${window.location.host} cannot play content of this type</h1>`
  }
}

function renderUserRunState([user, runStateId]) {
  const userHeader = document.createElement('h3')
  const runState = document.createElement('pre')
  Agent.watch(runStateId, ({state}) => {
    runState.innerHTML = ''
    runState.appendChild(
      document.createTextNode(JSON.stringify(state, null, 4))
    )
  })
  userHeader.appendChild(document.createTextNode(`User: ${user}`))
  document.body.appendChild(userHeader)
  document.body.appendChild(runState)
}