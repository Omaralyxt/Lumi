"use client";

import { useState } from "react";
import { Product, Review } from "@/types/product";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, Upload } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Omit<Review, 'id' | 'author' | 'date'>) => Promise<void>;
}

export default function ReviewForm({ product, isOpen, onClose, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Seu comentário deve ter pelo menos 10 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // Simular upload de imagem
      const imageUrls = images.map(file => URL.createObjectURL(file));
      
      await onSubmit({
        rating,
        comment,
        images: imageUrls,
        verifiedPurchase: true,
      });
      
      toast.success("Avaliação enviada com sucesso!");
      onClose();
      // Reset form
      setRating(0);
      setComment("");
      setImages([]);
    } catch (error) {
      toast.error("Falha ao enviar avaliação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avaliar Produto</DialogTitle>
          <DialogDescription>
            Deixe sua opinião sobre "{product.title}"
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Sua nota *</Label>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <button key={i} onClick={() => setRating(i + 1)}>
                  <Star className={`h-8 w-8 transition-colors ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Seu comentário *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte-nos sobre sua experiência com o produto..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Adicionar fotos (opcional)</Label>
            <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}