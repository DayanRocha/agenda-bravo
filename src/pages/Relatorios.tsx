import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart3, TrendingUp, Clock, DollarSign, FileText, Edit, Trash2, CalendarIcon, Save } from "lucide-react";
import { useRegistros } from "@/hooks/useRegistros";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Relatorios() {
  const { registros, editarRegistro, excluirRegistro } = useRegistros();
  const { toast } = useToast();
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString();
  
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [editingRegistro, setEditingRegistro] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    data: new Date(),
    horas: '',
    valorHora: '',
    descricao: ''
  });

  // Filtrar registros por mês e ano selecionados
  const filteredRegistros = registros.filter(registro => {
    const dataRegistro = new Date(registro.data);
    const mesRegistro = (dataRegistro.getMonth() + 1).toString();
    const anoRegistro = dataRegistro.getFullYear().toString();
    return mesRegistro === selectedMonth && anoRegistro === selectedYear;
  });

  // Calcular estatísticas reais
  const statsData = {
    diasTrabalhados: new Set(filteredRegistros.map(r => new Date(r.data).toDateString())).size,
    totalHoras: filteredRegistros.reduce((acc, r) => acc + r.horas, 0),
    valorAcumulado: filteredRegistros.reduce((acc, r) => acc + r.valorTotal, 0),
    mesAtual: `${getMonthName(selectedMonth)} ${selectedYear}`,
    totalRegistros: filteredRegistros.length
  };

  function getMonthName(month: string): string {
    const months = [
      '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[parseInt(month)];
  }

  // Gerar anos dinamicamente (de 2020 até 2050)
  const generateYearOptions = () => {
    const years = [];
    for (let year = 2050; year >= 2020; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const yearOptions = generateYearOptions();

  // Preparar dados do gráfico - agrupados por dia
  const chartData = () => {
    const dailyData = new Map();
    
    filteredRegistros.forEach(registro => {
      const dia = new Date(registro.data).getDate();
      const key = `${dia.toString().padStart(2, '0')}`;
      
      if (dailyData.has(key)) {
        dailyData.set(key, {
          dia: key,
          valor: dailyData.get(key).valor + registro.valorTotal,
          horas: dailyData.get(key).horas + registro.horas
        });
      } else {
        dailyData.set(key, {
          dia: key,
          valor: registro.valorTotal,
          horas: registro.horas
        });
      }
    });
    
    return Array.from(dailyData.values()).sort((a, b) => parseInt(a.dia) - parseInt(b.dia));
  };

  // Função para abrir edição
  const handleEdit = (registro: any) => {
    setEditingRegistro(registro);
    setEditFormData({
      data: new Date(registro.data),
      horas: registro.horas.toString(),
      valorHora: registro.valorHora.toString(),
      descricao: registro.descricao || ''
    });
    setIsEditDialogOpen(true);
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    if (!editFormData.horas || !editFormData.valorHora) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const horas = parseFloat(editFormData.horas);
    const valorHora = parseFloat(editFormData.valorHora);
    const valorTotal = horas * valorHora;
    
    editarRegistro(editingRegistro.id, {
      data: editFormData.data,
      horas,
      valorHora,
      descricao: editFormData.descricao,
      valorTotal
    });

    toast({
      title: "Sucesso",
      description: "Registro atualizado com sucesso!"
    });

    setIsEditDialogOpen(false);
    setEditingRegistro(null);
  };

  // Função para excluir registro
  const handleDelete = (id: string) => {
    excluirRegistro(id);
    toast({
      title: "Sucesso",
      description: "Registro excluído com sucesso!"
    });
  };

  // Função para exportar PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text(`Relatório - ${statsData.mesAtual}`, 20, 30);
    
    // Estatísticas
    doc.setFontSize(14);
    doc.text('Resumo do Período:', 20, 50);
    doc.setFontSize(12);
    doc.text(`Dias trabalhados: ${statsData.diasTrabalhados}`, 20, 65);
    doc.text(`Total de horas: ${statsData.totalHoras}h`, 20, 75);
    doc.text(`Valor acumulado: R$ ${statsData.valorAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 85);
    doc.text(`Total de registros: ${statsData.totalRegistros}`, 20, 95);
    
    // Lista de registros
    doc.text('Registros:', 20, 115);
    let yPos = 130;
    
    filteredRegistros.forEach((registro, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const data = new Date(registro.data).toLocaleDateString('pt-BR');
      doc.text(`${data} - ${registro.horas}h × R$ ${registro.valorHora.toFixed(2)} = R$ ${registro.valorTotal.toFixed(2)}`, 20, yPos);
      
      if (registro.descricao) {
        yPos += 8;
        doc.setFontSize(10);
        doc.text(`   ${registro.descricao}`, 20, yPos);
        doc.setFontSize(12);
      }
      
      yPos += 12;
    });
    
    // Salvar o PDF
    doc.save(`relatorio-${statsData.mesAtual.toLowerCase().replace(' ', '-')}.pdf`);
  };

  return (
    <Layout title="Relatórios">
      <div className="p-4 space-y-6">
        {/* Filtros */}
        <Card className="p-4 shadow-soft">
          <div className="flex gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Janeiro</SelectItem>
                <SelectItem value="2">Fevereiro</SelectItem>
                <SelectItem value="3">Março</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Maio</SelectItem>
                <SelectItem value="6">Junho</SelectItem>
                <SelectItem value="7">Julho</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Setembro</SelectItem>
                <SelectItem value="10">Outubro</SelectItem>
                <SelectItem value="11">Novembro</SelectItem>
                <SelectItem value="12">Dezembro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {filteredRegistros.length === 0 ? (
          <Card className="p-8 text-center shadow-soft">
            <div className="text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Nenhum registro encontrado</p>
              <p className="text-sm">para {statsData.mesAtual}</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-card shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dias</p>
                    <p className="text-xl font-bold">{statsData.diasTrabalhados}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-card shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horas</p>
                    <p className="text-xl font-bold">{statsData.totalHoras}h</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Card de Valor Total */}
            <Card className="p-6 bg-gradient-primary text-white shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Valor Acumulado</p>
                  <p className="text-white/80 text-xs">{statsData.mesAtual}</p>
                  <p className="text-3xl font-bold mt-1">
                    R$ {statsData.valorAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </Card>

            {/* Lista de Registros */}
            <Card className="p-4 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Registros de {statsData.mesAtual}</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredRegistros.map((registro) => (
                  <div key={registro.id} className="flex items-center justify-between p-3 bg-accent rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-medium">{new Date(registro.data).toLocaleDateString('pt-BR')}</p>
                      <p className="text-sm text-muted-foreground">
                        {registro.horas}h × R$ {registro.valorHora.toFixed(2)}
                      </p>
                      {registro.descricao && (
                        <p className="text-xs text-muted-foreground truncate mt-1">{registro.descricao}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2">
                        <p className="font-bold text-primary">R$ {registro.valorTotal.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(registro)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(registro.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Gráfico Real */}
        <Card className="p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Evolução Diária - {statsData.mesAtual}
          </h3>
          {chartData().length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dia" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Dia do Mês', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Valor (R$)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'valor' ? `R$ ${value.toFixed(2)}` : `${value}h`,
                      name === 'valor' ? 'Valor' : 'Horas'
                    ]}
                    labelFormatter={(label) => `Dia ${label}`}
                  />
                  <Bar dataKey="valor" fill="hsl(var(--primary))" name="valor" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum dado para exibir</p>
                <p className="text-sm">no período selecionado</p>
              </div>
            </div>
          )}
        </Card>

        {/* Ações */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-primary shadow-soft" 
            size="lg"
            onClick={exportToPDF}
            disabled={filteredRegistros.length === 0}
          >
            <FileText className="mr-2 h-5 w-5" />
            Exportar Relatório PDF
          </Button>
        </div>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Registro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-date">Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editFormData.data && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editFormData.data ? (
                        format(editFormData.data, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editFormData.data}
                      onSelect={(date) => date && setEditFormData({...editFormData, data: date})}
                      initialFocus
                      className="pointer-events-auto"
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="edit-horas">Horas Trabalhadas *</Label>
                <Input
                  id="edit-horas"
                  type="number"
                  step="0.5"
                  value={editFormData.horas}
                  onChange={(e) => setEditFormData({...editFormData, horas: e.target.value})}
                  placeholder="Ex: 8"
                />
              </div>

              <div>
                <Label htmlFor="edit-valorHora">Valor por Hora (R$) *</Label>
                <Input
                  id="edit-valorHora"
                  type="number"
                  step="0.01"
                  value={editFormData.valorHora}
                  onChange={(e) => setEditFormData({...editFormData, valorHora: e.target.value})}
                  placeholder="Ex: 50.00"
                />
              </div>

              <div>
                <Label htmlFor="edit-descricao">Descrição</Label>
                <Textarea
                  id="edit-descricao"
                  value={editFormData.descricao}
                  onChange={(e) => setEditFormData({...editFormData, descricao: e.target.value})}
                  placeholder="Descreva o trabalho realizado..."
                  rows={3}
                />
              </div>

              {editFormData.horas && editFormData.valorHora && (
                <Card className="p-3 bg-primary/5 border-primary/20">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-xl font-bold text-primary">
                      R$ {(parseFloat(editFormData.horas) * parseFloat(editFormData.valorHora)).toFixed(2)}
                    </p>
                  </div>
                </Card>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}