import React, { useState, useEffect } from 'react';
import { getCupom } from '../services/cupons';
import '../styles/MeusCupons.css';

const MeusCupons = ({ user }) => {
  const [cupons, setCupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchAndFilterCoupons = async () => {
      setIsLoading(true);
      try {
        const allCoupons = await getCupom();
        const userId = user.id;

        const userCoupons = allCoupons.filter(coupon => {
          const parts = coupon.code.split('-');
          // Formato TROCA-xxxxx-trocaId-userId
          if (parts.length === 4 && (coupon.type === 'EXCHANGE' || coupon.type === 'CREDIT')) {
            const couponUserId = parseInt(parts[3], 10);
            return couponUserId === userId;
          }
          return false; 
        });

        setCupons(userCoupons);
      } catch (error) {
        console.error("Erro ao buscar cupons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterCoupons();
  }, [user]);

  if (isLoading) {
    return <p>Carregando cupons...</p>;
  }

  if (cupons.length === 0) {
    return <p>Você não possui cupons no momento.</p>;
  }

  return (
    <div className="meus-cupons-container">
      {cupons.map(coupon => (
        <div key={coupon.id} className={`coupon-card-perfil ${coupon.used ? 'used' : 'available'}`}>
          <div className="coupon-card-perfil-header">
            <span className="coupon-code-perfil">{coupon.code}</span>
            <span className={`coupon-status-perfil ${coupon.used ? 'used' : 'available'}`}>
              {coupon.used ? 'Utilizado' : 'Disponível'}
            </span>
          </div>
          <div className="coupon-card-perfil-body">
            <p className="coupon-value-perfil">Valor: R$ {parseFloat(coupon.value).toFixed(2).replace('.', ',')}</p>
            <p className="coupon-type-perfil">Tipo: {coupon.type}</p>
            <p className="coupon-validity-perfil">
              Validade: {coupon.validity ? new Date(coupon.validity).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeusCupons;
