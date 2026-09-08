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

function parseMarkdownTableToChart(title?: string, content?: string) {
  if (!content || !content.includes('|')) return null;

  const rawLines = content.split('\n').map(l => l.trim());
  const tableLines = rawLines.filter(l => l.startsWith('|') && l.endsWith('|'));

  if (tableLines.length < 2) return null;

  // Header line
  const headers = tableLines[0]
    .split('|')
    .map(h => h.trim())
    .filter(Boolean);

  if (headers.length < 2) return null;

  // Data lines (filter out divider line like |---|---|)
  const dataLines = tableLines.slice(1).filter(l => !l.includes('---'));
  if (dataLines.length === 0) return null;

  const data: Record<string, any>[] = [];

  for (const line of dataLines) {
    const cells = line
      .split('|')
      .map(c => c.trim())
      .filter(Boolean);

    if (cells.length < 2) continue;

    const rowObj: Record<string, any> = {
      name: cells[0]
    };

    for (let i = 1; i < headers.length; i++) {
      const headerName = headers[i];
      const rawVal = cells[i] ? cells[i].replace(/[^\d.-]/g, '') : '';
      const numVal = parseFloat(rawVal);
      rowObj[headerName] = isNaN(numVal) || rawVal === '' ? (cells[i] || 0) : numVal;
    }

    data.push(rowObj);
  }

  if (data.length === 0) return null;

  const numericHeaders = headers.slice(1);
  const dataKeys = numericHeaders.map((h) => {
    let tone = 'primary';
    const lowerH = h.toLowerCase();
    if (lowerH.includes('təhlükəsiz') || lowerH.includes('safe') || lowerH.includes('pass')) {
      tone = 'success';
    } else if (lowerH.includes('şübhəli') || lowerH.includes('suspicious') || lowerH.includes('warn')) {
      tone = 'warning';
    } else if (lowerH.includes('blok') || lowerH.includes('danger') || lowerH.includes('risk')) {
      tone = 'danger';
    } else if (lowerH.includes('faiz') || lowerH.includes('percent')) {
      tone = 'purple';
    } else if (lowerH.includes('say') || lowerH.includes('count') || lowerH.includes('tarama')) {
      tone = 'info';
    }

    return {
      key: h,
      tone,
      label: h
    };
  });

  const firstHeaderLower = headers[0].toLowerCase();
  let chartType: 'area' | 'bar' | 'donut' = 'bar';

  if (firstHeaderLower.includes('tarix') || firstHeaderLower.includes('gün') || firstHeaderLower.includes('date')) {
    chartType = 'area';
  } else if (data.length <= 8 && numericHeaders.length === 1 && (firstHeaderLower.includes('növ') || firstHeaderLower.includes('type') || firstHeaderLower.includes('kategoriya'))) {
    chartType = 'donut';
  } else {
    chartType = 'bar';
  }

  return {
    title,
    chartType,
    data,
    chartKeys: {
      nameKey: 'name',
      dataKeys
    }
  };
}

function renderBlock(
  block: MessageBlock, 
  key: string | number, 
  animate: boolean = true, 
  onTyping?: () => void,
  onComplete?: () => void
) {
  switch (block.type) {
    case 'header':
      return <AiHeaderBlock key={key} title={block.title || ''} subtitle={block.subtitle} />;
    case 'text': {
      const parsedChart = parseMarkdownTableToChart(block.title, block.content);
      if (parsedChart) {
        return (
          <AiChartBlock
            key={key}
            title={parsedChart.title}
            chartType={parsedChart.chartType}
            data={parsedChart.data}
            chartKeys={parsedChart.chartKeys}
          />
        );
      }
      return <AiTextBlock key={key} content={block.content || ''} animate={animate} onTyping={onTyping} onComplete={onComplete} />;
    }
    case 'callout': {
      const parsedChart = parseMarkdownTableToChart(block.title, block.content);
      if (parsedChart) {
        return (
          <AiChartBlock
            key={key}
            title={parsedChart.title}
            chartType={parsedChart.chartType}
            data={parsedChart.data}
            chartKeys={parsedChart.chartKeys}
          />
        );
      }
      return <AiCalloutBlock key={key} tone={block.tone || 'info'} title={block.title} content={block.content || ''} />;
    }
    case 'table':
      return (
        <AiTableBlock 
          key={key} 
          title={block.title} 
          headers={block.headers} 
          rows={block.rows as any} 
          content={block.content}
          tableData={block.tableData}
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
      return <AiLinkBlock key={key} url={block.url || '#'} label={block.label || ''} description={block.description} />;
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

export const AiMessageRenderer: React.FC<{ 
  message: AiMessage; 
  animate?: boolean; 
  onTyping?: () => void;
  onComplete?: () => void;
}> = ({
  message,
  animate = true,
  onTyping,
  onComplete
}) => {
  const shouldAnimate = animate && !message.isAnimationFinished;
  const blocks = message.blocks || [];
  
  const [activeBlockIndex, setActiveBlockIndex] = React.useState(shouldAnimate ? 0 : blocks.length);

  const handleBlockComplete = (index: number) => {
    if (index === activeBlockIndex) {
      setTimeout(() => {
        setActiveBlockIndex(prev => {
          const next = prev + 1;
          if (next >= blocks.length && onComplete) {
            onComplete();
          }
          if (onTyping) onTyping(); // Scroll when new block starts
          return next;
        });
      }, 1000); // 1s delay
    }
  };

  React.useEffect(() => {
    if (!shouldAnimate) return;
    if (activeBlockIndex >= blocks.length) return;

    const currentBlock = blocks[activeBlockIndex];
    const isSelfManaging = currentBlock.type === 'text' || 
                           currentBlock.type === ('link_content_only' as any) ||
                           (currentBlock.type === 'link' && (currentBlock.content || (currentBlock as any).prefixText));
                           
    if (!isSelfManaging) {
      const timer = setTimeout(() => {
        handleBlockComplete(activeBlockIndex);
      }, 1000); // Wait 1s for fade-in to complete
      return () => clearTimeout(timer);
    }
  }, [activeBlockIndex, blocks, shouldAnimate]);

  return (
    <div className="flex flex-col gap-3 w-full text-left">
      {blocks.map((b: MessageBlock, i: number) => {
        if (i > activeBlockIndex) return null;

        const isCurrentlyActive = i === activeBlockIndex;
        const currentHandleComplete = () => handleBlockComplete(i);

        // Case 1: Link block with embedded text content
        if (b.type === 'link' && (b.content || (b as any).prefixText)) {
          const textContent = b.content || (b as any).prefixText;
          return (
            <React.Fragment key={`link-group-${message.id || 'msg'}-${i}`}>
              <AiTextBlock
                key={`text-sub-${message.id || 'msg'}-${i}`}
                content={textContent}
                animate={shouldAnimate}
                onTyping={onTyping}
                onComplete={currentHandleComplete}
              />
              {(!shouldAnimate || i < activeBlockIndex) && (
                <div className="animate-in fade-in zoom-in-95 duration-500 delay-150">
                  <AiLinkBlock
                    key={`link-sub-${message.id || 'msg'}-${i}`}
                    url={b.url || '#'}
                    label={b.label || ''}
                    description={b.description}
                  />
                </div>
              )}
            </React.Fragment>
          );
        }

        // New Case: link_content_only
        if (b.type === ('link_content_only' as any) && (b.content || (b as any).prefixText)) {
          return (
            <div
              key={`block-${message.id || 'msg'}-${i}`}
              className={shouldAnimate && isCurrentlyActive ? "animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both" : ""}
            >
              <AiTextBlock
                key={`text-sub-${message.id || 'msg'}-${i}`}
                content={b.content || (b as any).prefixText}
                animate={shouldAnimate}
                onTyping={onTyping}
                onComplete={currentHandleComplete}
              />
            </div>
          );
        }

        // Case 2: Standard text block
        if (b.type === 'text') {
          return (
            <div
              key={`block-${message.id || 'msg'}-${i}`}
              className={shouldAnimate && isCurrentlyActive ? "animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both" : ""}
            >
              <AiTextBlock
                key={`block-inner-${message.id || 'msg'}-${i}`}
                content={b.content || ''}
                animate={shouldAnimate}
                onTyping={onTyping}
                onComplete={currentHandleComplete}
              />
            </div>
          );
        }

        // Case 3: Link block without text
        if (b.type === 'link') {
          return (
            <div
              key={`block-${message.id || 'msg'}-${i}`}
              className={shouldAnimate && isCurrentlyActive ? "animate-in fade-in zoom-in-95 duration-1000" : ""}
            >
              <AiLinkBlock
                key={`block-inner-${message.id || 'msg'}-${i}`}
                url={b.url || '#'}
                label={b.label || ''}
                description={b.description}
              />
            </div>
          );
        }

        // Default: other blocks
        return (
          <div
            key={`block-${message.id || 'msg'}-${i}`}
            className={shouldAnimate && isCurrentlyActive ? "animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both" : ""}
          >
            {renderBlock(b, `block-inner-${message.id || 'msg'}-${i}`, shouldAnimate, onTyping, currentHandleComplete)}
          </div>
        );
      })}
    </div>
  );
};
