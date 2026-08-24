import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Card } from '../../ui/Card';

interface FileProps {
  name: string;
  sizeLabel: string;
  url?: string;
}

export const AiFileBlock: React.FC<FileProps> = ({ name, sizeLabel, url }) => {
  return (
    <div className="block my-2 group cursor-pointer w-full max-w-sm">
      <Card padding="md" className="hover:border-brand-blue/50 transition-colors bg-surface-container-lowest flex items-center justify-between group-hover:shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-label-md font-bold text-on-surface">{name}</p>
            <p className="text-body-sm text-on-surface-variant">{sizeLabel}</p>
          </div>
        </div>
        <a href={url || '#'} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors" title="Yüklə">
          <Download className="w-4 h-4" />
        </a>
      </Card>
    </div>
  );
};
