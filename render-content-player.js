export default async function (id) {
  const [ metadata, content, state ] = await Promise.all([
    Agent.metadata(id),
    Agent.state(id),
    Agent.state(`${id}/written-response`)
  ])

  if (metadata.active_type === 'application/json;type=writing-prompt') {
    const prompt = document.createElement('h1')
    const textarea = document.createElement('textarea')
    prompt.appendChild(document.createTextNode(content.prompt))

    if (state.response === undefined) state.response = ''
    textarea.placeholder = 'Respond to the prompt'
    textarea.value = state.response
    textarea.addEventListener('keyup', () => {
      state.response = textarea.value
      console.log(state, textarea.value)
    })
    document.body.appendChild(prompt)
    document.body.appendChild(textarea)
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
      document.createTextNode(`Response:\n${state.response}`)
    )
  })
  userHeader.appendChild(document.createTextNode(`User: ${user}`))
  document.body.appendChild(userHeader)
  document.body.appendChild(runState)
}