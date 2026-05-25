type SectionLabelProps = {
  index: string;
  label: string;
};

export function SectionLabel({ index, label }: SectionLabelProps) {
  return (
    <div className="mono-label mb-5 flex items-center gap-3 text-xs uppercase text-muted">
      <span className="text-austrian-red">{index}</span>
      <span>{`// ${label}`}</span>
    </div>
  );
}
