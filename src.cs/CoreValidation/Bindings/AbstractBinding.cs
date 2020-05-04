namespace CoreValidation.Bindings
{
  public abstract class AbstractBinding
  {
    public abstract object GetState(object source, object opts);
    public abstract void SetState(object source, object opts, object values);
    public abstract object GetErrors(object source);
    public abstract void SetErrors(object source, object errors);
  }
}
