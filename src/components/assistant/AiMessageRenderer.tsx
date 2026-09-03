import React from 'react';
import { AiMessage, MessageBlock } from '../../types';
import { 
  AiHeaderBlock,
  AiTextBlock, 
  AiCalloutBlock, 
  AiTableBlock, 
  AiChartBlock, 
  AiLinkBlock, 
  AiFileBlock, 
  AiImageBlock,
  AiAnalysisBlock,
  AiListBlock,
  AiCodeBlock,
  AiQuoteBlock
} from './blocks';

function renderBlock(block: MessageBlock, key: number, animate: boolean = true, onTyping?: () => void) {
  switch (block.type) {
    case 'header':
      return <AiHeaderBlock key={key} title={block.title || ''} subtitle={block.subtitle} />;
    case 'text':
      return <AiTextBlock key={key} content={block.content || ''} animate={animate} onTyping={onTyping} />;
    case 'callout':
      return <AiCalloutBlock key={key} tone={block.tone || 'info'} title={block.title} content={block.content || ''} />;
    case 'table':
      return (
        <AiTableBlock 
          key={key} 
          title={block.title} 
          headers={block.headers || block.tableData?.headers || []} 
          rows={(block.rows || block.tableData?.rows || []) as (string | number)[][]} 
        />
      );
    case 'chart':
      return (
        <AiChartBlock 
          key={key} 
          title={block.title} 
          subtitle={block.subtitle} 
          chartType={block.chartType} 
          data={block.chartData || (block as any).data || []} 
          chartKeys={block.chartKeys}
        />
      );
    case 'list':
      return <AiListBlock key={key} title={block.title} items={block.items || []} listType={block.listType} />;
    case 'code':
      return <AiCodeBlock key={key} title={block.title} code={block.code || block.content || ''} language={block.language} />;
    case 'quote':
      return <AiQuoteBlock key={key} title={block.title} content={block.content || ''} author={block.author} date={block.date} />;
    case 'link':
      return <AiLinkBlock key={key} url={block.url || '#'} label={block.label || ''} description={block.description} prefixText={block.content} />;
    case 'file':
      return <AiFileBlock key={key} name={block.name || ''} sizeLabel={block.sizeLabel || ''} url={block.url} />;
    case 'image':
      return (
        <AiImageBlock
          key={key}
          title={block.title}
          description={block.description}
          url={block.imageUrl || block.url}
          alt={block.imageAlt || block.label}
          actionLabel={block.actionLabel}
          actionUrl={block.actionUrl}
        />
      );
    case 'analysis':
      return block.analysisData ? <AiAnalysisBlock key={key} data={block.analysisData} /> : null;
    default:
      return null;
  }
}

export const AiMessageRenderer: React.FC<{ message: AiMessage; animate?: boolean; onTyping?: () => void }> = ({
  message,
  animate = true,
  onTyping
}) => {
  return (
    <div className="flex flex-col gap-4 w-full text-left">
      {(message.blocks || []).map((b: MessageBlock, i: number) => (
        <div
          key={i}
          className="animate-in fade-in slide-in-from-bottom-4 duration-600 ease-out fill-mode-both"
          style={{ animationDelay: `${i * 140}ms` }}
        >
          {renderBlock(b, i, animate, onTyping)}
        </div>
      ))}
    </div>
  );
};
