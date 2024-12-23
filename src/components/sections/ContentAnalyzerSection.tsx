import { MessagePanel } from "./analyzer/MessagePanel";
import { InputPanel } from "./analyzer/InputPanel";
import { ResultsPanel } from "./analyzer/ResultsPanel";
import { useContentAnalyzer } from "@/hooks/use-content-analyzer";

export const ContentAnalyzerSection = () => {
  const {
    textContent,
    context,
    purpose,
    analysis,
    isAnalyzing,
    showWaitlist,
    resultsRef,
    setTextContent,
    setContext,
    setPurpose,
    setShowWaitlist,
    handleAnalyze,
  } = useContentAnalyzer();

  return (
    <div className="content-analyzer-section grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <MessagePanel />
      <InputPanel
        textContent={textContent}
        context={context}
        purpose={purpose}
        isAnalyzing={isAnalyzing}
        showWaitlist={showWaitlist}
        onTextContentChange={setTextContent}
        onContextChange={setContext}
        onPurposeChange={setPurpose}
        onAnalyze={handleAnalyze}
        onShowWaitlist={() => setShowWaitlist(true)}
      />
      <div ref={resultsRef}>
        <ResultsPanel analysis={analysis} />
      </div>
    </div>
  );
};