'use client'

import { useState } from 'react'
import PostReader from './PostReader'
import TableOfContents from './TableOfContents'

interface PostReaderWithTOCProps {
  content: string
  enablePagination?: boolean
  showTableOfContents?: boolean
}

export default function PostReaderWithTOC({ content, enablePagination = false, showTableOfContents = true }: PostReaderWithTOCProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChangeFromTOC = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      {/* TOC Inline */}
      {showTableOfContents && (
        <TableOfContents 
          content={content} 
          enablePagination={enablePagination}
          currentPage={currentPage}
          onNavigate={handlePageChangeFromTOC}
        />
      )}
      
      {/* Main Content */}
      <PostReader 
        content={content}
        enablePagination={enablePagination}
        showTableOfContents={showTableOfContents}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
