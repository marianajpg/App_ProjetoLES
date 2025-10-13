import React, { useState, useEffect } from 'react';
import '../styles/modal.css'; // Usar o CSS do modal padrão

const EditAddressForm = ({ address, onFormChange }) => {
  const [formData, setFormData] = useState(address);

  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const tiposEndereco = [
    { value: 'RESIDENCIAL', label: 'Residencial' },
    { value: 'COMERCIAL', label: 'Comercial' },
    { value: 'OUTRO', label: 'Outro' }
  ];

  const tiposLogradouro = [
    { value: 'RUA', label: 'Rua' },
    { value: 'AVENIDA', label: 'Avenida' },
    { value: 'ALAMEDA', label: 'Alameda' },
    { value: 'PRACA', label: 'Praça' },
    { value: 'TRAVESSA', label: 'Travessa' },
    { value: 'RODOVIA', label: 'Rodovia' },
    { value: 'ESTRADA', label: 'Estrada' },
    { value: 'OUTRO', label: 'Outro' },
  ];

  return (
    <div>
        <div className="form-group">
            <label>Apelido do Endereço</label>
            <input type="text" name="observations" value={formData.observations || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Tipo de Endereço</label>
            <select name="residenceType" value={formData.residenceType} onChange={handleChange}>
                {tiposEndereco.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
        </div>
        <div className="form-group">
            <label>Tipo de Logradouro</label>
            <select name="streetType" value={formData.streetType} onChange={handleChange}>
                {tiposLogradouro.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
        </div>
        <div className="form-group">
            <label>CEP</label>
            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Logradouro</label>
            <input type="text" name="street" value={formData.street} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Número</label>
            <input type="text" name="number" value={formData.number} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Complemento</label>
            <input type="text" name="complement" value={formData.complement || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Bairro</label>
            <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Cidade</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label>Estado (UF)</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} maxLength="2" />
        </div>
    </div>
  );
};

export default EditAddressForm;
