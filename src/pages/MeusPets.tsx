import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  PawPrint,
  ArrowLeft,
  Calendar
} from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed: string | null;
  age_years: number | null;
  weight_kg: number | null;
  temperament: string | null;
  special_needs: string | null;
  medications: string | null;
  photo_url: string | null;
}

const MeusPets = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "dog" as "dog" | "cat" | "other",
    breed: "",
    age_years: "",
    weight_kg: "",
    temperament: "",
    special_needs: "",
    medications: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar pets");
    } else {
      setPets(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const petData = {
      user_id: user.id,
      name: formData.name,
      species: formData.species,
      breed: formData.breed || null,
      age_years: formData.age_years ? parseInt(formData.age_years) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      temperament: formData.temperament || null,
      special_needs: formData.special_needs || null,
      medications: formData.medications || null,
    };

    if (editingPet) {
      const { error } = await supabase
        .from("pets")
        .update(petData)
        .eq("id", editingPet.id);

      if (error) {
        toast.error("Erro ao atualizar pet");
      } else {
        toast.success("Pet atualizado com sucesso!");
        fetchPets();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("pets")
        .insert(petData);

      if (error) {
        toast.error("Erro ao cadastrar pet");
      } else {
        toast.success("Pet cadastrado com sucesso!");
        fetchPets();
        resetForm();
      }
    }
  };

  const handleDelete = async (petId: string) => {
    if (!confirm("Tem certeza que deseja remover este pet?")) return;

    const { error } = await supabase
      .from("pets")
      .update({ is_active: false })
      .eq("id", petId);

    if (error) {
      toast.error("Erro ao remover pet");
    } else {
      toast.success("Pet removido com sucesso");
      fetchPets();
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      age_years: pet.age_years?.toString() || "",
      weight_kg: pet.weight_kg?.toString() || "",
      temperament: pet.temperament || "",
      special_needs: pet.special_needs || "",
      medications: pet.medications || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPet(null);
    setFormData({
      name: "",
      species: "dog",
      breed: "",
      age_years: "",
      weight_kg: "",
      temperament: "",
      special_needs: "",
      medications: "",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const speciesLabels = {
    dog: "Cachorro",
    cat: "Gato",
    other: "Outro",
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container-section py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Meus Pets</h1>
              <p className="text-muted-foreground">Gerencie os dados dos seus pets</p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pet
              </Button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="card-elevated p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {editingPet ? "Editar Pet" : "Cadastrar Novo Pet"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome do pet *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Especie *
                    </label>
                    <select
                      className="input-field"
                      value={formData.species}
                      onChange={(e) => setFormData({ ...formData, species: e.target.value as "dog" | "cat" | "other" })}
                    >
                      <option value="dog">Cachorro</option>
                      <option value="cat">Gato</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Raca
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ex: Golden Retriever"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Idade (anos)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      max="30"
                      value={formData.age_years}
                      onChange={(e) => setFormData({ ...formData, age_years: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      step="0.1"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Temperamento
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ex: Calmo, brincalhao"
                      value={formData.temperament}
                      onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Necessidades especiais
                  </label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Descreva qualquer necessidade especial"
                    value={formData.special_needs}
                    onChange={(e) => setFormData({ ...formData, special_needs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Medicacoes
                  </label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Liste medicacoes e horarios"
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit">
                    {editingPet ? "Salvar alteracoes" : "Cadastrar pet"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Pet List */}
          {pets.length === 0 && !showForm ? (
            <div className="card-elevated p-8 text-center">
              <PawPrint className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Nenhum pet cadastrado
              </h2>
              <p className="text-muted-foreground mb-6">
                Cadastre seus pets para agendar servicos
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar primeiro pet
              </Button>
            </div>
          ) : !showForm && pets.length > 0 ? (
            <>
              <div className="flex justify-end mb-4">
                <Button asChild>
                  <Link to="/novo-pedido">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Serviço
                  </Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="card-elevated p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <PawPrint className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(pet)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(pet.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {speciesLabels[pet.species]}
                      {pet.breed && ` - ${pet.breed}`}
                    </p>
                    <div className="space-y-1 text-sm">
                      {pet.age_years && (
                        <p className="text-muted-foreground">{pet.age_years} anos</p>
                      )}
                      {pet.weight_kg && (
                        <p className="text-muted-foreground">{pet.weight_kg} kg</p>
                      )}
                      {pet.temperament && (
                        <p className="text-muted-foreground">{pet.temperament}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MeusPets;
