import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";

export default function Configuracoes() {
  const [valorPadrao, setValorPadrao] = useState('50.00');
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Carregar configurações salvas
  useEffect(() => {
    const savedValor = localStorage.getItem('valorPadraoHora');
    if (savedValor) setValorPadrao(savedValor);
  }, []);

  // Salvar valor padrão automaticamente quando mudar
  const handleValorChange = (value: string) => {
    setValorPadrao(value);
    localStorage.setItem('valorPadraoHora', value);
    toast({
      title: "Valor salvo",
      description: "Valor padrão atualizado automaticamente!"
    });
  };

  const handleThemeChange = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
  };

  return (
    <Layout title="Configurações">
      <div className="p-4 space-y-6">
        {/* Valor Padrão */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Valor por Hora</h3>
              <p className="text-sm text-muted-foreground">Valor padrão para novos registros</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="valorPadrao">Valor Padrão (R$)</Label>
            <Input
              id="valorPadrao"
              type="number"
              step="0.01"
              value={valorPadrao}
              onChange={(e) => handleValorChange(e.target.value)}
              placeholder="50.00"
              className="text-lg mt-2"
            />
          </div>
        </Card>

        {/* Tema */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Tema Escuro</h3>
                <p className="text-sm text-muted-foreground">Alternar entre claro e escuro</p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />
          </div>
        </Card>

        <Separator />

        {/* Informações do App */}
        <Card className="p-6 shadow-soft">
          <h3 className="font-semibold mb-4">Sobre o App</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Controle de Bicos</strong></p>
            <p>Versão 1.0.0</p>
            <p>Gerencie suas horas e valores de trabalho de forma simples e eficiente.</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}