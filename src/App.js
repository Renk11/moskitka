import { useEffect, useMemo, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  AdaptivityProvider,
  AppRoot,
  Button,
  Checkbox,
  Div,
  FixedLayout,
  FormItem,
  Input,
  Link,
  ModalCard,
  ModalRoot,
  Panel,
  PanelHeader,
  SplitCol,
  SplitLayout,
  Textarea,
  View,
} from '@vkontakte/vkui';

const MESH_TYPES = {
  standard: { label: 'Стандарт', extra: 0 },
  antiCat: { label: 'Антикошка', extra: 500 },
};

const PROFILE_TYPES = {
  p25: { label: 'Профиль СТАНДАРТ', extra: 200 },
  p32: { label: 'Профиль КРЫЛО', extra: 300 },
};

const FRAME_COLORS = {
  white: { label: 'Белый', extra: 0, swatch: '#f8fafc' },
  brown: { label: 'Коричневый', extra: 0, swatch: '#7c4a2d' },
};

const EXTRA_OPTIONS = {
  handles: { label: 'Ручки пластиковые 2 шт.', price: 75 },
  crossbar: { label: 'Поперечный профиль 1 шт.', price: 75 },
  zset: { label: 'Крепёж Z-образный металл. 4 шт.', price: 80 },
  install: { label: 'Установка', price: 300 },
};

const SERVICE_OPTIONS = {
  measureCity: { label: 'Выезд на замер Сыктывкар', price: 0 },
  measureArea: { label: 'Выезд на замер Эжва, Выльгорт, Затон', price: 400 },
  deliveryCity: { label: 'Доставка Сыктывкар', price: 0 },
  deliveryArea: { label: 'Доставка Эжва, Выльгорт, Затон', price: 400 },
};

const BASE_MESH_PRICE_PER_M2 = 340;
const BASE_FRAME_PRICE_PER_M = 160;
const MIN_ITEM_PRICE = 0;

const styles = {
  page: {
    background: '#f4f6f8',
    minHeight: '100vh',
    paddingBottom: 170,
  },

  hero: {
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
    background: '#ffffff',
    boxShadow: '0 8px 30px rgba(16, 24, 40, 0.08)',
  },

  heroTop: {
    padding: 16,
    background: 'linear-gradient(135deg, #f8fafc 0%, #eef4ff 100%)',
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: 8,
    color: '#1f2937',
  },

  heroText: {
    fontSize: 14,
    lineHeight: 1.45,
    color: '#5b6472',
  },

  realImageWrap: {
    marginTop: 14,
    borderRadius: 16,
    overflow: 'hidden',
    background: '#ffffff',
    border: '1px solid #e7ecf3',
  },

  realImage: {
    display: 'block',
    width: '100%',
    height: 'auto',
  },

  section: {
    margin: '12px 12px 0',
    borderRadius: 20,
    overflow: 'hidden',
    background: '#ffffff',
    boxShadow: '0 8px 30px rgba(16, 24, 40, 0.06)',
  },

  sectionHeader: (bg, color) => ({
    padding: '14px 16px',
    background: bg,
    color,
    fontSize: 17,
    fontWeight: 800,
  }),

  sectionBody: {
    paddingBottom: 4,
  },

  compactTwoCol: {
    display: 'grid',
    gap: 10,
    gridTemplateColumns: '1fr 1fr',
  },

  colorGrid: {
    display: 'grid',
    gap: 10,
    gridTemplateColumns: '1fr 1fr',
  },

  colorCard: (active) => ({
    borderRadius: 16,
    padding: 12,
    border: active ? '2px solid #2563eb' : '1px solid #e5e7eb',
    background: active ? '#eff6ff' : '#ffffff',
    boxShadow: active
      ? '0 8px 20px rgba(37, 99, 235, 0.12)'
      : '0 4px 12px rgba(15, 23, 42, 0.04)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }),

  colorDot: (color) => ({
    width: 18,
    height: 18,
    borderRadius: 999,
    background: color,
    border: '1px solid rgba(0,0,0,0.08)',
    flexShrink: 0,
  }),

  colorTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.2,
  },

  choiceRow2: {
    display: 'grid',
    gap: 10,
    gridTemplateColumns: '1fr 1fr',
  },

  choiceCard: (active) => ({
    borderRadius: 14,
    padding: '8px 14px',
    border: active ? '2px solid #2563eb' : '1px solid #e5e7eb',
    background: active ? '#eff6ff' : '#ffffff',
    boxShadow: active
      ? '0 6px 18px rgba(37, 99, 235, 0.12)'
      : '0 4px 12px rgba(15, 23, 42, 0.04)',
    cursor: 'pointer',
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
  }),

  choiceTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.2,
  },

  choiceMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 1.2,
  },

  smallQtyWrap: {
    maxWidth: 110,
  },

  profileHelpLinkWrap: {
    marginTop: -4,
    padding: '0 16px 12px',
  },

  optionList: {
    display: 'grid',
    gap: 10,
  },

  optionRow: (active, tone = 'green') => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    border:
      tone === 'blue'
        ? active
          ? '2px solid #c7d2fe'
          : '1px solid #e5e7eb'
        : active
          ? '2px solid #86efac'
          : '1px solid #e5e7eb',
    background:
      tone === 'blue'
        ? active
          ? '#eef2ff'
          : '#ffffff'
        : active
          ? '#f0fdf4'
          : '#ffffff',
    boxShadow: active
      ? '0 8px 20px rgba(15, 23, 42, 0.06)'
      : '0 4px 12px rgba(15, 23, 42, 0.04)',
  }),

  optionInfo: {
    minWidth: 0,
    flex: 1,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.3,
    overflowWrap: 'break-word',
  },

  optionPrice: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },

  optionAction: {
    flexShrink: 0,
    minWidth: 52,
    display: 'flex',
    justifyContent: 'flex-end',
  },

  twinWrap: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: '1fr',
    margin: '12px 12px 0',
    alignItems: 'stretch',
  },

  twinCard: {
    borderRadius: 20,
    overflow: 'hidden',
    background: '#ffffff',
    boxShadow: '0 8px 30px rgba(16, 24, 40, 0.06)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  twinBody: {
    paddingBottom: 4,
    flex: 1,
  },

  summaryCard: {
    margin: 12,
    borderRadius: 20,
    background: '#ffffff',
    boxShadow: '0 8px 30px rgba(16, 24, 40, 0.08)',
    overflow: 'hidden',
  },

  summaryTop: {
    padding: 16,
    background: 'linear-gradient(135deg, #eef6ff 0%, #f9fbff 100%)',
  },

  totalBox: {
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
    color: '#fff',
  },

  totalCaption: {
    fontSize: 13,
    opacity: 0.9,
    textAlign: 'right',
  },

  totalValue: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1.1,
    textAlign: 'right',
    width: '100%',
  },

  stickyBar: {
    background: 'rgba(255,255,255,0.96)',
    borderTop: '1px solid #e6ebf2',
    backdropFilter: 'blur(8px)',
  },

  stickyInner: {
    maxWidth: 700,
    margin: '0 auto',
    padding: 12,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  stickyMeta: {
    minWidth: 0,
  },

  stickyLabel: {
    fontSize: 12,
    color: '#64748b',
  },

  stickyValue: {
    fontSize: 24,
    fontWeight: 800,
    color: '#111827',
    lineHeight: 1.1,
  },

  profileCompareGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },

  profileCompareCard: {
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 12,
    background: '#fff',
  },

  profileCompareImage: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
  },

  profileCompareTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 800,
    color: '#111827',
  },

  profileCompareText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 1.35,
    color: '#6b7280',
  },
};

const ChoiceCard = ({ title, meta, active, onClick }) => (
  <div style={styles.choiceCard(active)} onClick={onClick}>
    <div>
      <div style={styles.choiceTitle}>{title}</div>
      {meta ? <div style={styles.choiceMeta}>{meta}</div> : null}
    </div>
  </div>
);

const ColorCard = ({ title, swatch, active, onClick }) => (
  <div style={styles.colorCard(active)} onClick={onClick}>
    <div style={styles.colorDot(swatch)} />
    <div style={styles.colorTitle}>{title}</div>
  </div>
);

const OptionRow = ({ title, price, checked, onChange, tone = 'green' }) => (
  <div style={styles.optionRow(checked, tone)}>
    <div style={styles.optionInfo}>
      <div style={styles.optionTitle}>{title}</div>
      <div style={styles.optionPrice}>+{price} ₽</div>
    </div>
    <div style={styles.optionAction}>
      <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)}>
        Вкл
      </Checkbox>
    </div>
  </div>
);

export const App = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const [meshType, setMeshType] = useState('standard');
  const [profileType, setProfileType] = useState('p25');
  const [frameColor, setFrameColor] = useState('white');
  const [quantity, setQuantity] = useState('1');

  const [extraHandles, setExtraHandles] = useState(true);
  const [extraCrossbar, setExtraCrossbar] = useState(true);
  const [extraZset, setExtraZset] = useState(true);
  const [extraInstall, setExtraInstall] = useState(false);

  const [measureCity, setMeasureCity] = useState(false);
  const [measureArea, setMeasureArea] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    bridge.send('VKWebAppInit');

    bridge
      .send('VKWebAppGetUserInfo')
      .then((data) => {
        setUser(data);
        if (data?.first_name) {
          setName(data.first_name);
        }
      })
      .catch((error) => {
        console.error('Ошибка получения данных пользователя:', error);
      });
  }, []);

  const calc = useMemo(() => {
    const safeWidth = Math.max(100, Number(width) || 0);
    const safeHeight = Math.max(100, Number(height) || 0);
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    const widthM = safeWidth / 1000;
    const heightM = safeHeight / 1000;

    const areaM2 = widthM * heightM;
    const perimeterM = 2 * (widthM + heightM);

    const baseMeshCost = Math.round(areaM2 * BASE_MESH_PRICE_PER_M2);
    const baseFrameCost = Math.round(perimeterM * BASE_FRAME_PRICE_PER_M);

    const meshExtra = MESH_TYPES[meshType].extra;
    const profileExtra = PROFILE_TYPES[profileType].extra;
    const colorExtra = FRAME_COLORS[frameColor].extra;

    const extrasPerItem =
      (extraHandles ? EXTRA_OPTIONS.handles.price : 0) +
      (extraCrossbar ? EXTRA_OPTIONS.crossbar.price : 0) +
      (extraZset ? EXTRA_OPTIONS.zset.price : 0) +
      (extraInstall ? EXTRA_OPTIONS.install.price : 0);

    const rawItemPrice =
      baseMeshCost +
      baseFrameCost +
      meshExtra +
      profileExtra +
      colorExtra +
      extrasPerItem;

    const itemPrice = Math.max(MIN_ITEM_PRICE, rawItemPrice);
    const itemsTotal = itemPrice * safeQuantity;

    const serviceTotal =
      (measureCity ? SERVICE_OPTIONS.measureCity.price : 0) +
      (measureArea ? SERVICE_OPTIONS.measureArea.price : 0) +
      (deliveryCity ? SERVICE_OPTIONS.deliveryCity.price : 0) +
      (deliveryArea ? SERVICE_OPTIONS.deliveryArea.price : 0);

    const total = itemsTotal + serviceTotal;

    return {
      safeWidth,
      safeHeight,
      safeQuantity,
      total,
    };
  }, [
    width,
    height,
    quantity,
    meshType,
    profileType,
    frameColor,
    extraHandles,
    extraCrossbar,
    extraZset,
    extraInstall,
    measureCity,
    measureArea,
    deliveryCity,
    deliveryArea,
  ]);

  const submitOrder = async () => {
  if (!phone.trim()) {
    alert('Укажите телефон');
    return;
  }

  if (!width.trim() || !height.trim()) {
    alert('Укажите ширину и высоту');
    return;
  }

  try {
    setIsSending(true);

    const response = await fetch('moskitka-production.up.railway.app/send-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vkUserId: user?.id || null,
        name: name || '-',
        phone,
        comment: comment || '-',
        width: calc.safeWidth,
        height: calc.safeHeight,
        quantity: calc.safeQuantity,
        meshType: MESH_TYPES[meshType].label,
        profileType: PROFILE_TYPES[profileType].label,
        frameColor: FRAME_COLORS[frameColor].label,
        extras: {
          handles: extraHandles,
          crossbar: extraCrossbar,
          zset: extraZset,
          install: extraInstall,
        },
        services: {
          measureCity,
          measureArea,
          deliveryCity,
          deliveryArea,
        },
        total: calc.total,
      }),
    });

    const rawText = await response.text();
    console.log('Server raw response:', rawText);

    let data = {};
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Сервер вернул не JSON: ${rawText}`);
      }
    }

    if (!response.ok || !data.ok) {
      throw new Error(data?.error || `HTTP ${response.status}`);
    }

    alert('Заявка отправлена в Telegram');
    setPhone('');
    setComment('');
  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    alert(`Ошибка: ${error.message}`);
  } finally {
    setIsSending(false);
  }
};

  const modal = (
    <ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
      <ModalCard
        id="profile_compare"
        onClose={() => setActiveModal(null)}
        header="Отличие профилей"
      >
        <div style={styles.profileCompareGrid}>
          <div style={styles.profileCompareCard}>
            <img
              src="/1.png"
              alt="Профиль стандарт"
              style={styles.profileCompareImage}
            />
            <div style={styles.profileCompareTitle}>СТАНДАРТ</div>
            <div style={styles.profileCompareText}>
              Классический рамочный профиль для стандартной москитной сетки.
            </div>
          </div>

          <div style={styles.profileCompareCard}>
            <img
              src="/2.jpg"
              alt="Профиль крыло"
              style={styles.profileCompareImage}
            />
            <div style={styles.profileCompareTitle}>КРЫЛО</div>
            <div style={styles.profileCompareText}>
              Главной особенностью новой москитной сетки «Крыло» является наличие на профиле выступа в виде крыла.
            </div>
          </div>
        </div>
      </ModalCard>
    </ModalRoot>
  );

  return (
    <AdaptivityProvider>
      <AppRoot>
        <SplitLayout modal={modal}>
          <SplitCol>
            <View activePanel="main">
              <Panel id="main">
                <PanelHeader>Москитные сетки на заказ</PanelHeader>

                <div style={styles.page}>
                  <div style={styles.hero}>
                    <div style={styles.heroTop}>
                      <div style={styles.heroTitle}>Предварительный расчёт стоимости</div>
                      <div style={styles.heroText}>
                        Укажите размеры от резинки до резинки и выберите комплектацию.
                      </div>

                      <div style={styles.realImageWrap}>
                        <img
                          src="/moskitnie-setki-za-1-den-dostavka-bez-predoplati_foto_largest.jpg"
                          alt="Как правильно замерить москитную сетку"
                          style={styles.realImage}
                        />
                      </div>
                    </div>

                    <div style={{ padding: 8 }}>
                      <FormItem top="Размеры, мм">
                        <div style={styles.compactTwoCol}>
                          <Input
                            type="number"
                            min="100"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Высота"
                          />
                          <Input
                            type="number"
                            min="100"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="Ширина"
                          />
                        </div>
                      </FormItem>
                    </div>
                  </div>

                  <div style={styles.section}>
                    <div style={styles.sectionHeader('#f8f0dc', '#8a6a00')}>
                      Конфигурация
                    </div>

                    <div style={styles.sectionBody}>
                      <FormItem top="Цвет рамки">
                        <div style={styles.colorGrid}>
                          {Object.entries(FRAME_COLORS).map(([value, item]) => (
                            <ColorCard
                              key={value}
                              active={frameColor === value}
                              onClick={() => setFrameColor(value)}
                              title={item.label}
                              swatch={item.swatch}
                            />
                          ))}
                        </div>
                      </FormItem>

                      <FormItem top="Тип сетки">
                        <div style={styles.choiceRow2}>
                          {Object.entries(MESH_TYPES).map(([value, item]) => (
                            <ChoiceCard
                              key={value}
                              active={meshType === value}
                              onClick={() => setMeshType(value)}
                              title={item.label}
                              meta={`+${item.extra} ₽`}
                            />
                          ))}
                        </div>
                      </FormItem>

                      <FormItem top="Профиль">
                        <div style={styles.choiceRow2}>
                          {Object.entries(PROFILE_TYPES).map(([value, item]) => (
                            <ChoiceCard
                              key={value}
                              active={profileType === value}
                              onClick={() => setProfileType(value)}
                              title={item.label}
                              meta={`+${item.extra} ₽`}
                            />
                          ))}
                        </div>
                      </FormItem>

                      <div style={styles.profileHelpLinkWrap}>
                        <Link onClick={() => setActiveModal('profile_compare')}>
                          Посмотреть отличие профилей
                        </Link>
                      </div>

                      <FormItem top="Количество">
                        <div style={styles.smallQtyWrap}>
                          <Input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="1"
                          />
                        </div>
                      </FormItem>
                    </div>
                  </div>

                  <div style={styles.twinWrap}>
                    <div style={styles.twinCard}>
                      <div style={styles.sectionHeader('#eaf7ef', '#257a46')}>
                        Доборные элементы
                      </div>
                      <div style={styles.twinBody}>
                        <FormItem top="Комплектация">
                          <div style={styles.optionList}>
                            <OptionRow
                              title={EXTRA_OPTIONS.handles.label}
                              price={EXTRA_OPTIONS.handles.price}
                              checked={extraHandles}
                              onChange={setExtraHandles}
                            />
                            <OptionRow
                              title={EXTRA_OPTIONS.crossbar.label}
                              price={EXTRA_OPTIONS.crossbar.price}
                              checked={extraCrossbar}
                              onChange={setExtraCrossbar}
                            />
                            <OptionRow
                              title={EXTRA_OPTIONS.zset.label}
                              price={EXTRA_OPTIONS.zset.price}
                              checked={extraZset}
                              onChange={setExtraZset}
                            />
                            <OptionRow
                              title={EXTRA_OPTIONS.install.label}
                              price={EXTRA_OPTIONS.install.price}
                              checked={extraInstall}
                              onChange={setExtraInstall}
                            />
                          </div>
                        </FormItem>
                      </div>
                    </div>

                    <div style={styles.twinCard}>
                      <div style={styles.sectionHeader('#eef2ff', '#3730a3')}>
                        Сервис
                      </div>
                      <div style={styles.twinBody}>
                        <FormItem top="Услуги">
                          <div style={styles.optionList}>
                            <OptionRow
                              title={SERVICE_OPTIONS.measureCity.label}
                              price={SERVICE_OPTIONS.measureCity.price}
                              checked={measureCity}
                              onChange={setMeasureCity}
                              tone="blue"
                            />
                            <OptionRow
                              title={SERVICE_OPTIONS.measureArea.label}
                              price={SERVICE_OPTIONS.measureArea.price}
                              checked={measureArea}
                              onChange={setMeasureArea}
                              tone="blue"
                            />
                            <OptionRow
                              title={SERVICE_OPTIONS.deliveryCity.label}
                              price={SERVICE_OPTIONS.deliveryCity.price}
                              checked={deliveryCity}
                              onChange={setDeliveryCity}
                              tone="blue"
                            />
                            <OptionRow
                              title={SERVICE_OPTIONS.deliveryArea.label}
                              price={SERVICE_OPTIONS.deliveryArea.price}
                              checked={deliveryArea}
                              onChange={setDeliveryArea}
                              tone="blue"
                            />
                          </div>
                        </FormItem>
                      </div>
                    </div>
                  </div>

                  <div style={styles.section}>
                    <div style={styles.sectionHeader('#eef6ff', '#1d4ed8')}>
                      Контактные данные
                    </div>
                    <div style={styles.sectionBody}>
                      <FormItem top="Ваше имя">
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Введите имя"
                        />
                      </FormItem>

                      <FormItem top="Телефон">
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 (___) ___-__-__"
                        />
                      </FormItem>

                      <FormItem top="Комментарий">
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Например: нужен замер, удобное время звонка, этаж, особенности окна"
                        />
                      </FormItem>
                    </div>
                  </div>

                  <div style={styles.summaryCard}>
                    <div style={styles.summaryTop}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#1f2937' }}>
                        Сводка расчёта
                      </div>

                      <div style={styles.totalBox}>
                        <div style={styles.totalCaption}>Итог по заказу</div>
                        <div style={styles.totalValue}>
                          {calc.total.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      <Div style={{ padding: '12px 0 0', color: '#6b7280', fontSize: 13 }}>
                        * Будьте внимательны при самостоятельном замере.
                      </Div>
                    </div>
                  </div>
                </div>

                <FixedLayout vertical="bottom" filled style={styles.stickyBar}>
                  <div style={styles.stickyInner}>
                    <div style={styles.stickyMeta}>
                      <div style={styles.stickyLabel}>*Предварительный расчёт.</div>
                      <div style={styles.stickyValue}>
                        {calc.total.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>

                    <Button size="l" disabled={isSending} onClick={submitOrder}>
                      {isSending ? 'Отправка...' : 'Отправить заявку'}
                    </Button>
                  </div>
                </FixedLayout>
              </Panel>
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </AdaptivityProvider>
  );
};