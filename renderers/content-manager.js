export default async function renderContentManager() {
  document.body.innerHTML = '<h1>Content Manager</h1>'

  const contentEntries = document.createElement('div')

  Agent.watch('content', ({ state }) => {
    // clear out old content entries
    contentEntries.innerHTML = ''

    // append updated content entries to the contentEntried div
    Object
      .keys(state)
      .forEach(id => {
        const entry = createContentEntry(id)
        contentEntries.appendChild(entry)
      })
  })

  const contentCreator = document.createElement('div')

  contentCreator.innerHTML = `
    <h1>Content Customiser</h1>
    <textarea id="writing-prompt" placeholder="Enter your writing prompt"></textarea>
    <br>
    <button onclick="createDrawingPrompt()">Create new writing prompt content</button>
  `
  document.body.appendChild(contentEntries)
  document.body.appendChild(contentCreator)
}

function createContentEntry(id) {
  const contentEntry = document.createElement('div')
  contentEntry.className = 'prompt-list-entry'

  contentEntry.draggable = true
  contentEntry.addEventListener('dragstart', event => {
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.setData('text/uri-list', id)
  })

  const removeButton = document.createElement('button')
  const prompt = document.createElement('div')
  prompt.className = 'prompt-display'
  const dashboardButton = document.createElement('button')
  const playButton = document.createElement('button')

  removeButton.innerHTML = 'x'
  removeButton.addEventListener('click', async () => {
    const allContent = await Agent.state('content')
    delete allContent[id]
  })

  dashboardButton.innerHTML = 'Launch Dashboard'
  dashboardButton.addEventListener('click', async () => {
    const stateInfoForContent = await Agent.query('nameQuery', [`${id}/written-response`])

    const userDrawStates = {}
    stateInfoForContent.forEach(({ id, user }) => {
      userDrawStates[user] = id
    })

    const dashboardConfigId = Agent.create({
      active_type: 'application/json;type=dashboard-config',
      active: {
        [id]: userDrawStates
      }
    })

    window.location.href = `/${dashboardConfigId}`
  })

  playButton.innerHTML = 'Play'
  playButton.addEventListener('click', async () => {
    window.location.href = `/${id}`
  })

  contentEntry.appendChild(removeButton)
  contentEntry.appendChild(prompt)
  contentEntry.appendChild(dashboardButton)
  contentEntry.appendChild(playButton)

  Agent
    .state(id)
    .then(content => {
      const promptText = document.createTextNode(content.prompt)
      prompt.appendChild(promptText)
    })

  return contentEntry
}

window.createDrawingPrompt = async function () {
  const el = document.getElementById('writing-prompt')
  const prompt = el.value.trim()

  if (prompt.length) {
    const content = await Agent.state('content')
    const id = await Agent.create({
      active_type: 'application/json;type=writing-prompt',
      active: { prompt }
    })
    content[id] = { added: Date.now() }
    el.value = ''
  }
  else alert('Please enter a writing prompt!')
}