
import React from 'react';

interface StyleSelectorProps {
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ customPrompt, onCustomPromptChange }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-gray-700">الخطوة 2: وصف الخلفية</h2>
      <p className="text-sm text-gray-500 mb-4">
        سيتم إنشاء صور باستخدام عدة أنماط محددة مسبقًا. أو يمكنك وصف الخلفية التي تريدها بنفسك.
      </p>
      <textarea
        value={customPrompt}
        onChange={(e) => onCustomPromptChange(e.target.value)}
        placeholder="مثال: على سطح رخامي أبيض مع زهرة بجانبه"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
        rows={3}
      />
      <p className="text-xs text-gray-400 mt-2">
        إذا تركت هذا الحقل فارغًا، سيتم استخدام الأنماط المحددة مسبقًا تلقائيًا.
      </p>
    </div>
  );
};

export default StyleSelector;
