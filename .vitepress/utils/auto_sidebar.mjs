import fs from 'fs'
import path from 'path'

/**
 * 自动生成指定目录的侧边栏配置
 * @param {string} dirPath - 目录路径 (如: "/backend/rabbitmq" 或 "/frontend/react")
 * @returns {Array} 侧边栏配置数组
 */
export function set_sidebar(dirPath) {
  // 移除开头的斜杠，转换为相对于项目根目录的路径
  const relativePath = dirPath.startsWith('/') ? dirPath.slice(1) : dirPath
  const fullPath = path.join(process.cwd(), relativePath)
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`目录不存在: ${fullPath}`)
    return []
  }
  
  return generateSidebarItems(fullPath, dirPath)
}

/**
 * 递归生成侧边栏项目
 * @param {string} dir - 物理目录路径
 * @param {string} basePath - URL基础路径
 * @returns {Array} 侧边栏项目数组
 */
function generateSidebarItems(dir, basePath) {
  const items = []
  
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    
    files.forEach(file => {
      const filePath = path.join(dir, file.name)
      
      if (file.isDirectory()) {
        // 处理子目录
        const subItems = generateSidebarItems(filePath, `${basePath}/${file.name}`)
        if (subItems.length > 0) {
          items.push({
            text: file.name,
            collapsed: true,
            items: subItems
          })
        }
      } else if (file.isFile() && file.name.endsWith('.md')) {
        const fileName = path.basename(file.name, '.md')
        
        // 跳过index.md文件，因为它是目录首页
        if (fileName === 'index') {
          return
        }
        
        // 提取文件标题
        let title = fileName
        try {
          const content = fs.readFileSync(filePath, 'utf-8')
          const titleMatch = content.match(/^#\s+(.+)$/m)
          if (titleMatch) {
            title = titleMatch[1].trim()
          }
        } catch (err) {
          console.warn(`无法读取文件标题: ${filePath}`)
        }
        
        // 生成链接 - 修改为指向根目录下的实际文件
        const link = `${basePath}/${fileName}`
        
        items.push({
          text: title,
          link: link
        })
      }
    })
    
    // 排序：目录在前，文件在后
    items.sort((a, b) => {
      if (a.items && !b.items) return -1
      if (!a.items && b.items) return 1
      return a.text.localeCompare(b.text)
    })
    
  } catch (err) {
    console.error(`读取目录失败: ${dir}`, err)
  }
  
  return items
}
