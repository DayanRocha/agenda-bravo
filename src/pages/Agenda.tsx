import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegistros, type Registro } from "@/hooks/useRegistros";
import { ptBR } from "date-fns/locale";

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { adicionarRegistro, editarRegistro, excluirRegistro, obterRegistrosPorData, obterRegistroPorId } = useRegistros();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    horas: '',
    valorHora: '',
    descricao: ''
  });
  const { toast } = useToast();

  const handleSaveRegistro = () => {
    if (!selectedDate || !formData.horas || !formData.valorHora) {
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

    const registroData = {
      data: selectedDate,
      horas,
      valorHora,
      descricao: formData.descricao,
      valorTotal
    };

    if (isEditMode && editingId) {
      editarRegistro(editingId, registroData);
      toast({
        title: "Sucesso",
        description: "Registro atualizado!"
      });
    } else {
      adicionarRegistro(registroData);
      toast({
        title: "Sucesso",
        description: `Registro salvo! Valor total: R$ ${valorTotal.toFixed(2)}`
      });
    }

    handleCloseDialog();
  };

  const handleEditRegistro = (registro: Registro) => {
    setFormData({
      horas: registro.horas.toString(),
      valorHora: registro.valorHora.toString(),
      descricao: registro.descricao
    });
    setIsEditMode(true);
    setEditingId(registro.id);
    setIsDialogOpen(true);
  };

  const handleDeleteRegistro = (id: string) => {
    excluirRegistro(id);
    toast({
      title: "Sucesso",
      description: "Registro excluído!"
    });
  };

  const handleCloseDialog = () => {
    setFormData({ horas: '', valorHora: '', descricao: '' });
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  const registrosDoData = selectedDate ? obterRegistrosPorData(selectedDate) : [];

  const valorTotalDia = registrosDoData.reduce((acc, r) => acc + r.valorTotal, 0);

  return (
    <Layout title="Agenda">
      <div className="p-4 space-y-6">
        <Card className="p-4 bg-gradient-card shadow-card">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-lg"
            locale={ptBR}
          />
        </Card>

        {selectedDate && (
          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString('pt-BR')}
              </h3>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) {
                  handleCloseDialog();
                }
              }}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary shadow-soft"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Editar Registro' : 'Novo Registro'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="horas">Horas Trabalhadas *</Label>
                      <Input
                        id="horas"
                        type="number"
                        step="0.5"
                        value={formData.horas}
                        onChange={(e) => setFormData({...formData, horas: e.target.value})}
                        placeholder="Ex: 8"
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        placeholder="Descreva o trabalho realizado..."
                        rows={3}
                      />
                    </div>
                    {formData.horas && formData.valorHora && (
                      <div className="p-3 bg-accent rounded-lg">
                        <p className="text-sm text-muted-foreground">Valor Total:</p>
                        <p className="text-xl font-bold text-primary">
                          R$ {(parseFloat(formData.horas) * parseFloat(formData.valorHora)).toFixed(2)}
                        </p>
                      </div>
                    )}
                    <Button onClick={handleSaveRegistro} className="w-full bg-gradient-primary">
                      {isEditMode ? 'Atualizar Registro' : 'Salvar Registro'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {registrosDoData.length > 0 ? (
              <div className="space-y-3">
                {registrosDoData.map((registro) => (
                  <div key={registro.id} className="p-3 bg-accent rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{registro.horas}h × R$ {registro.valorHora.toFixed(2)}</p>
                        {registro.descricao && (
                          <p className="text-sm text-muted-foreground mt-1">{registro.descricao}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-primary mr-2">R$ {registro.valorTotal.toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditRegistro(registro)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit size={14} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O registro será permanentemente excluído.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRegistro(registro.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total do Dia:</span>
                    <span className="text-xl font-bold text-primary">R$ {valorTotalDia.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhum registro para este dia
              </p>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
}