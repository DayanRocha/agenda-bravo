import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRegistros } from "@/hooks/useRegistros";

export default function NovoRegistro() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    horas: '',
    valorHora: '50.00', // Será atualizado com o valor das configurações
    descricao: ''
  });
  const { toast } = useToast();
  const { adicionarRegistro } = useRegistros();

  // Carregar valor padrão das configurações
  useEffect(() => {
    const savedValor = localStorage.getItem('valorPadraoHora');
    if (savedValor) {
      setFormData(prev => ({ ...prev, valorHora: savedValor }));
    }
  }, []);

  const handleSave = () => {
    if (!formData.horas || !formData.valorHora) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const horas = parseFloat(formData.horas);
    const valorHora = parseFloat(formData.valorHora);
    const valorTotal = horas * valorHora;
    
    adicionarRegistro({
      data: selectedDate,
      horas,
      valorHora,
      descricao: formData.descricao,
      valorTotal
    });

    toast({
      title: "Sucesso",
      description: `Registro salvo! Valor total: R$ ${valorTotal.toFixed(2)}`
    });

    // Limpar formulário mas manter valor padrão
    const savedValor = localStorage.getItem('valorPadraoHora') || '50.00';
    setFormData({ horas: '', valorHora: savedValor, descricao: '' });
    setSelectedDate(new Date());
  };

  const valorTotal = formData.horas && formData.valorHora 
    ? parseFloat(formData.horas) * parseFloat(formData.valorHora)
    : 0;

  return (
    <Layout title="Novo Registro">
      <div className="p-4">
        <Card className="p-6 shadow-card bg-gradient-card max-w-md mx-auto">
          <div className="space-y-6">
            <div>
              <Label htmlFor="date">Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="horas">Horas Trabalhadas *</Label>
              <Input
                id="horas"
                type="number"
                step="0.5"
                value={formData.horas}
                onChange={(e) => setFormData({...formData, horas: e.target.value})}
                placeholder="Ex: 8"
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="valorHora">Valor por Hora (R$) *</Label>
              <Input
                id="valorHora"
                type="number"
                step="0.01"
                value={formData.valorHora}
                onChange={(e) => setFormData({...formData, valorHora: e.target.value})}
                placeholder="Ex: 50.00"
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descreva o trabalho realizado..."
                rows={4}
              />
            </div>

            {valorTotal > 0 && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-3xl font-bold text-primary">
                    R$ {valorTotal.toFixed(2)}
                  </p>
                </div>
              </Card>
            )}

            <Button 
              onClick={handleSave} 
              className="w-full bg-gradient-primary shadow-soft text-lg py-6"
            >
              <Save size={20} className="mr-2" />
              Salvar Registro
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}