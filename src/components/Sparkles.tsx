import { motion } from "framer-motion";
import { Icon } from "./icons";

export type SparkleItem = { top: string; left: string; size?: number };

export function Sparkles({ items }: { items: SparkleItem[] }) {
  return (
    <>
      {items.map((item, index) => (
        <motion.span
          key={`${item.top}-${item.left}`}
          className="sparkle"
          style={{ top: item.top, left: item.left, fontSize: item.size || 14 }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
        >
          <Icon.Sparkle />
        </motion.span>
      ))}
    </>
  );
}
