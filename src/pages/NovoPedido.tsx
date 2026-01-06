import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  PawPrint,
  MapPin,
  Calendar,
  Clock,
  CreditCard
} from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface ServiceVariant {
  id: string;
  service_id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  neighborhood: string;
}

const NovoPedido = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [variants, setVariants] = useState<ServiceVariant[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  // Selection
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");

  // New address form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Casa",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    zip_code: "",
    instructions: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [petsRes, servicesRes, variantsRes, extrasRes, addressesRes] = await Promise.all([
      supabase.from("pets").select("id, name, species, breed").eq("is_active", true),
      supabase.from("services").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("service_variants").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("service_extras").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("addresses").select("id, label, street, number, neighborhood"),
    ]);

    if (petsRes.data) setPets(petsRes.data);
    if (servicesRes.data) setServices(servicesRes.data);
    if (variantsRes.data) setVariants(variantsRes.data);
    if (extrasRes.data) setExtras(extrasRes.data);
    if (addressesRes.data) setAddresses(addressesRes.data);
    
    setIsLoading(false);
  };

  const formatPrice = (price: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const getSelectedVariant = () => variants.find(v => v.id === selectedVariant);
  const getSelectedService = () => services.find(s => s.id === selectedService);
  
  const calculateTotal = () => {
    const variant = getSelectedVariant();
    if (!variant) return 0;
    
    let total = variant.price;
    
    // Add extras
    selectedExtras.forEach(extraId => {
      const extra = extras.find(e => e.id === extraId);
      if (extra) total += extra.price;
    });
    
    // Add extra pet fee (R$20 per additional pet)
    if (selectedPets.length > 1) {
      total += (selectedPets.length - 1) * 20;
    }
    
    return total;
  };

  const handleTogglePet = (petId: string) => {
    setSelectedPets(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

  const handleToggleExtra = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        ...newAddress,
        city: "São Paulo",
        state: "SP",
      })
      .select()
      .single();

    if (error) {
      toast.error("Erro ao salvar endereço");
    } else {
      setAddresses([...addresses, data]);
      setSelectedAddress(data.id);
      setShowNewAddress(false);
      toast.success("Endereço salvo!");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService && selectedVariant;
      case 2: return selectedPets.length > 0;
      case 3: return selectedAddress;
      case 4: return selectedDate && selectedTime;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    const variant = getSelectedVariant();
    if (!variant) return;

    const extrasTotal = selectedExtras.reduce((sum, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    
    const additionalPetFee = selectedPets.length > 1 ? (selectedPets.length - 1) * 20 : 0;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        service_variant_id: selectedVariant,
        address_id: selectedAddress,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        subtotal: variant.price,
        extras_total: extrasTotal,
        additional_pet_fee: additionalPetFee,
        total_price: calculateTotal(),
        notes: notes || null,
      })
      .select()
      .single();

    if (bookingError) {
      toast.error("Erro ao criar pedido");
      setIsSubmitting(false);
      return;
    }

    // Add pets to booking
    const bookingPets = selectedPets.map(petId => ({
      booking_id: booking.id,
      pet_id: petId,
    }));

    await supabase.from("booking_pets").insert(bookingPets);

    // Add extras to booking
    if (selectedExtras.length > 0) {
      const bookingExtras = selectedExtras.map(extraId => {
        const extra = extras.find(e => e.id === extraId);
        return {
          booking_id: booking.id,
          extra_id: extraId,
          price_at_booking: extra?.price || 0,
        };
      });

      await supabase.from("booking_extras").insert(bookingExtras);
    }

    toast.success("Pedido criado com sucesso!");
    navigate("/meus-pedidos");
  };

  // Generate available times
  const availableTimes = [
    "08:00", "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split("T")[0];
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Check if user has pets
  if (pets.length === 0) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container-section py-8">
            <div className="card-elevated p-8 text-center max-w-md mx-auto">
              <PawPrint className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Cadastre um pet primeiro
              </h2>
              <p className="text-muted-foreground mb-6">
                Voce precisa cadastrar pelo menos um pet para fazer um agendamento
              </p>
              <Button asChild>
                <Link to="/meus-pets">Cadastrar pet</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Servico", icon: Clock },
    { num: 2, label: "Pets", icon: PawPrint },
    { num: 3, label: "Endereco", icon: MapPin },
    { num: 4, label: "Data", icon: Calendar },
    { num: 5, label: "Confirmar", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container-section py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Novo Agendamento</h1>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex flex-col items-center ${i > 0 ? "ml-4" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= s.num 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground hidden sm:block">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-12 lg:w-16 mx-2 ${
                    step > s.num ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto">
            <div className="card-elevated p-6">
              {/* Step 1: Service */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Escolha o servico</h2>
                  
                  <div className="space-y-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedService(service.id);
                          setSelectedVariant("");
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          selectedService === service.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </button>
                    ))}
                  </div>

                  {selectedService && (
                    <div className="space-y-3 pt-4 border-t">
                      <h3 className="font-semibold text-foreground">Duracao</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {variants.filter(v => v.service_id === selectedService).map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant.id)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              selectedVariant === variant.id 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <p className="font-semibold text-foreground">{variant.name}</p>
                            <p className="text-lg font-bold text-primary">{formatPrice(variant.price)}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Pets */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Selecione os pets</h2>
                  <p className="text-sm text-muted-foreground">
                    Taxa de R$20 por pet adicional
                  </p>
                  
                  <div className="grid gap-3">
                    {pets.map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => handleTogglePet(pet.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                          selectedPets.includes(pet.id) 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <PawPrint className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{pet.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pet.species === "dog" ? "Cachorro" : pet.species === "cat" ? "Gato" : "Outro"}
                            {pet.breed && ` - ${pet.breed}`}
                          </p>
                        </div>
                        {selectedPets.includes(pet.id) && (
                          <Check className="w-6 h-6 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Address */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Endereco do servico</h2>
                  
                  {addresses.length > 0 && !showNewAddress && (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <button
                          key={address.id}
                          onClick={() => setSelectedAddress(address.id)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            selectedAddress === address.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <p className="font-semibold text-foreground">{address.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.street}, {address.number} - {address.neighborhood}
                          </p>
                        </button>
                      ))}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowNewAddress(true)}
                      >
                        Adicionar novo endereco
                      </Button>
                    </div>
                  )}

                  {(showNewAddress || addresses.length === 0) && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">Apelido</label>
                          <input
                            className="input-field"
                            placeholder="Ex: Casa, Trabalho"
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">Rua</label>
                          <input
                            className="input-field"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Numero</label>
                          <input
                            className="input-field"
                            value={newAddress.number}
                            onChange={(e) => setNewAddress({...newAddress, number: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Complemento</label>
                          <input
                            className="input-field"
                            placeholder="Apto, bloco..."
                            value={newAddress.complement}
                            onChange={(e) => setNewAddress({...newAddress, complement: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Bairro</label>
                          <input
                            className="input-field"
                            value={newAddress.neighborhood}
                            onChange={(e) => setNewAddress({...newAddress, neighborhood: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CEP</label>
                          <input
                            className="input-field"
                            value={newAddress.zip_code}
                            onChange={(e) => setNewAddress({...newAddress, zip_code: e.target.value})}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">Instrucoes (portaria, chave...)</label>
                          <textarea
                            className="input-field min-h-[80px]"
                            value={newAddress.instructions}
                            onChange={(e) => setNewAddress({...newAddress, instructions: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleSaveAddress}>Salvar endereco</Button>
                        {addresses.length > 0 && (
                          <Button variant="outline" onClick={() => setShowNewAddress(false)}>
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Date/Time */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Escolha data e horario</h2>
                  
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Data</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableDates.map((date) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 rounded-lg border-2 text-center text-sm transition-all ${
                            selectedDate === date 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {formatDate(date)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground mb-3">Horario</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                            selectedTime === time 
                              ? "border-primary bg-primary/5 text-primary" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground mb-3">Extras (opcional)</h3>
                    <div className="space-y-2">
                      {extras.map((extra) => (
                        <button
                          key={extra.id}
                          onClick={() => handleToggleExtra(extra.id)}
                          className={`w-full p-3 rounded-lg border-2 text-left flex items-center justify-between transition-all ${
                            selectedExtras.includes(extra.id) 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div>
                            <span className="font-medium">{extra.name}</span>
                            {extra.description && (
                              <p className="text-xs text-muted-foreground">{extra.description}</p>
                            )}
                          </div>
                          <span className="font-bold text-accent">+{formatPrice(extra.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground mb-3">Observacoes (opcional)</h3>
                    <textarea
                      className="input-field min-h-[80px]"
                      placeholder="Alguma instrucao especial?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Confirm */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Confirme seu pedido</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary rounded-xl">
                      <p className="text-sm text-muted-foreground">Servico</p>
                      <p className="font-semibold text-foreground">
                        {getSelectedService()?.name} - {getSelectedVariant()?.name}
                      </p>
                    </div>

                    <div className="p-4 bg-secondary rounded-xl">
                      <p className="text-sm text-muted-foreground">Pets</p>
                      <p className="font-semibold text-foreground">
                        {pets.filter(p => selectedPets.includes(p.id)).map(p => p.name).join(", ")}
                      </p>
                    </div>

                    <div className="p-4 bg-secondary rounded-xl">
                      <p className="text-sm text-muted-foreground">Endereco</p>
                      <p className="font-semibold text-foreground">
                        {addresses.find(a => a.id === selectedAddress)?.street}, {" "}
                        {addresses.find(a => a.id === selectedAddress)?.number}
                      </p>
                    </div>

                    <div className="p-4 bg-secondary rounded-xl">
                      <p className="text-sm text-muted-foreground">Data e horario</p>
                      <p className="font-semibold text-foreground">
                        {formatDate(selectedDate)} as {selectedTime}
                      </p>
                    </div>

                    {selectedExtras.length > 0 && (
                      <div className="p-4 bg-secondary rounded-xl">
                        <p className="text-sm text-muted-foreground">Extras</p>
                        <p className="font-semibold text-foreground">
                          {extras.filter(e => selectedExtras.includes(e.id)).map(e => e.name).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(getSelectedVariant()?.price || 0)}</span>
                    </div>
                    {selectedExtras.length > 0 && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Extras</span>
                        <span>{formatPrice(selectedExtras.reduce((sum, id) => {
                          const extra = extras.find(e => e.id === id);
                          return sum + (extra?.price || 0);
                        }, 0))}</span>
                      </div>
                    )}
                    {selectedPets.length > 1 && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Pet adicional ({selectedPets.length - 1}x)</span>
                        <span>{formatPrice((selectedPets.length - 1) * 20)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                ) : (
                  <div />
                )}
                
                {step < 5 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                    Proximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Processando..." : "Confirmar Pedido"}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NovoPedido;
