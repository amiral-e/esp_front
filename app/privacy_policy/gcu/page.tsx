import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import '../../styles/gcuPolitics.css'

export default async function GCUPage() {
  const filePath = path.join(process.cwd(), 'content', 'gcu.md')
  const content = fs.readFileSync(filePath, 'utf-8')

  return (
    <div className="container" id='gcu-politics'>
      <div className="content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
