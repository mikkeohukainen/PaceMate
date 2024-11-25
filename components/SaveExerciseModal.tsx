import { ExerciseType } from "@/lib/exercise";
import { useState } from "react";
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
  onSave: (exerciseType: ExerciseType) => void;
}

const SaveExerciseModal = ({
  visible,
  onDismiss,
  onSave,
}: SaveExerciseModalProps) => {
  const theme = useTheme();
  const [exerciseType, setExerciseType] = useState<ExerciseType>("running");

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Save Exercise</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            onValueChange={(value) => setExerciseType(value as ExerciseType)}
            value={exerciseType}
          >
            <RadioButton.Item label="Running" value="running" />
            <RadioButton.Item label="Walking" value="walking" />
            <RadioButton.Item label="Cycling" value="cycling" />
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
