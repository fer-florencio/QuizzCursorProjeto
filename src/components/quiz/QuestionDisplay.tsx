interface QuestionDisplayProps {
  text: string;
}

export function QuestionDisplay({ text }: QuestionDisplayProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card p-8 text-center">
      <p className="text-xl font-medium leading-relaxed text-white md:text-2xl">
        {text}
      </p>
    </div>
  );
}
