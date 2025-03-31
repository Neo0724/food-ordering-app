import {StyleSheet, Text, View} from 'react-native';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import QRCode from 'react-native-qrcode-svg';

export default function PayAtCounterPage() {
  return (
    <View style={styles.parentContainter}>
      <View style={[styles.qrContainer, ShadowStyle.shadowBox]}>
        <Text style={styles.title}>QR Code Payment</Text>
        <View style={styles.qrCodeContainer}>
          <QRCode
            // value="order-123456"
            size={200}
            backgroundColor="white"
            color="black"
          />
        </View>
        <Text style={styles.description}>
          This QR code will be scanned by the cashier to proceed with your
          payment
        </Text>
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>
          1. Show this QR code to the cashier
        </Text>
        <Text style={styles.instructionText}>
          2. Make payment at the counter
        </Text>
        <Text style={styles.instructionText}>
          3. Wait for your order to be prepared
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainter: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'rgba(0,0,0,0.8)',
    textAlign: 'center',
  },
  qrCodeContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
  },
  instructionContainer: {
    width: '100%',
    padding: 16,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'rgba(0,0,0,0.8)',
  },
  instructionText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.7)',
    marginBottom: 8,
  },
});
