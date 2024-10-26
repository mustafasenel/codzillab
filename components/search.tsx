import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

export function Search({ value, onChange, onClick }: SearchProps) {
  return (
    <div className="w-full flex items-center space-x-4">
      <Input
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Ara..."
        className="w-full md:w-[200px] lg:w-[300px]"
      />
      <Button onClick={onClick}>Ara</Button>
    </div>
  );
}

export default Search;
