import React, { useState } from "react";
import {
  Dialog,
  Portal,
  Button,
  RadioButton,
  useTheme,
} from "react-native-paper";

interface SaveExerciseModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (exerciseType: string) => void;
}

const SaveExerciseModal: React.FC<SaveExerciseModalProps> = ({
  visible,
  onDismiss,
  onSave,
}) => {
  const theme = useTheme();
  const [exerciseType, setExerciseType] = useState<string>("Running");

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Save Exercise</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            onValueChange={(value) => setExerciseType(value)}
            value={exerciseType}
          >
            <RadioButton.Item label="Running" value="Running" />
            <RadioButton.Item label="Walking" value="Walking" />
            <RadioButton.Item label="Cycling" value="Cycling" />
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={theme.colors.error}>
            Cancel
          </Button>
          <Button onPress={() => onSave(exerciseType)}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SaveExerciseModal;
