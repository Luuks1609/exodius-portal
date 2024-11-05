import { Check, Clock, XCircle } from "lucide-react";

type Variant = "Paid" | "Pending" | "Not sent";

const variantClasses: Record<Variant, React.ReactNode> = {
  Paid: <Check className="text-green-500" size={18} />,
  Pending: <Clock className="text-yellow-500" size={18} />,
  "Not sent": <XCircle className="text-gray-500" size={18} />,
};

export default function StatusBadge({
  text,
}: {
  text: string; // Change type to string to accept any string
}) {
  const variant = text as Variant; // Cast text to Variant
  return (
    <div className="flex items-center gap-x-2 rounded bg-transparent px-3 py-2 font-semibold text-foreground">
      {variantClasses[variant]}
      {text}
    </div>
  );
}
